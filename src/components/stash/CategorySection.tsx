import { ReactNode } from "react";

interface CategorySectionProps {
  title: string;
  children: ReactNode;
}

export const CategorySection = ({ title, children }: CategorySectionProps) => {
  return (
    <section className="w-full space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold px-6 py-3 bg-gradient-to-r from-stash-purple/10 to-transparent rounded-lg">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
};

export default CategorySection;