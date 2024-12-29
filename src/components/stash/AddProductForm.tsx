import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().optional(),
  affiliateLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  image: z.instanceof(FileList).optional(),
});

const AddProductForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingAmazon, setIsFetchingAmazon] = useState(false);
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      affiliateLink: "",
      categoryId: "",
    },
  });

  const fetchAmazonProduct = async (url: string) => {
    try {
      setIsFetchingAmazon(true);
      const response = await supabase.functions.invoke('fetch-amazon-product', {
        body: { url }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch product data');
      }

      const data = response.data;
      console.log('Amazon product data:', data);
      
      if (data.name) form.setValue("name", data.name);
      if (data.brand) form.setValue("brand", data.brand);
      if (data.image_url) {
        // Convert image URL to File object
        const imageResponse = await fetch(data.image_url);
        const blob = await imageResponse.blob();
        const file = new File([blob], "product-image.jpg", { type: "image/jpeg" });
        const fileList = new DataTransfer();
        fileList.items.add(file);
        form.setValue("image", fileList.files);
      }
    } catch (error: any) {
      console.error('Error fetching Amazon product:', error);
      toast.error(error.message || "Failed to fetch product data");
    } finally {
      setIsFetchingAmazon(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      let imageUrl = null;

      // Handle image upload if provided
      if (values.image?.[0]) {
        const file = values.image[0];
        const fileExt = file.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      // Get the user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Insert the product
      const { error: insertError } = await supabase.from("products").insert({
        name: values.name,
        brand: values.brand || null,
        affiliate_link: values.affiliateLink || null,
        image_url: imageUrl,
        user_id: user.id,
        category_id: values.categoryId,
      });

      if (insertError) {
        throw insertError;
      }

      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Product added successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAffiliateLinkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url && url.includes("amazon")) {
      await fetchAmazonProduct(url);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon Affiliate Link (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  onChange={(e) => {
                    field.onChange(e);
                    handleAffiliateLinkChange(e);
                  }}
                  disabled={isFetchingAmazon}
                />
              </FormControl>
              {isFetchingAmazon && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching product details...
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Product Image (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isUploading || isFetchingAmazon}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;