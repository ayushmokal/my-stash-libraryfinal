import { ReactNode } from "react";

interface CategorySectionProps {
  title: string;
  children: ReactNode;
}

export const CategorySection = ({ title, children }: CategorySectionProps) => {
  return (
    <section className="w-full space-y-4 animate-fade-in">
      <h2 className="text-2xl font-semibold px-4 py-2 bg-stash-gray rounded-lg">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
};

export default CategorySection;