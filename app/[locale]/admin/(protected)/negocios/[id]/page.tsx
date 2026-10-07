import { notFound } from "next/navigation";
import BusinessForm from "@/components/BusinessForm";
import { createClient } from "@/lib/supabase/server";
import type { Business, BusinessPhoto } from "@/lib/types";
import { updateBusiness } from "../../../actions";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!business) {
    notFound();
  }

  const { data: photos } = await supabase
    .from("business_photos")
    .select("*")
    .eq("business_id", id)
    .order("position");

  const updateWithId = updateBusiness.bind(null, id);

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl text-clay-dark">
        Editar negocio
      </h2>
      <BusinessForm
        locale={locale}
        business={business as Business}
        photos={(photos ?? []) as BusinessPhoto[]}
        action={updateWithId}
      />
    </div>
  );
}
