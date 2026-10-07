import BusinessForm from "@/components/BusinessForm";
import { createBusiness } from "../../../actions";

export default async function NewBusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl text-clay-dark">Nuevo negocio</h2>
      <BusinessForm locale={locale} action={createBusiness} />
    </div>
  );
}
