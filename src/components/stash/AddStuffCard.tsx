import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AddStuffCard = () => {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      className="w-full h-[300px] flex flex-col items-center justify-center space-y-4 bg-stash-gray hover:bg-stash-gray-dark border-2 border-dashed border-gray-300 rounded-lg transition-colors"
      onClick={() => toast({
        title: "Coming soon!",
        description: "Add stuff functionality will be implemented in the next version.",
      })}
    >
      <Plus size={48} className="text-gray-400" />
      <div className="text-xl font-semibold">
        Add<br />your Stuff
      </div>
    </Button>
  );
};

export default AddStuffCard;