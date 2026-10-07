import type { Business, BusinessPhoto } from "@/lib/types";
import { photoUrl } from "@/lib/supabase/storage";
import { deletePhoto } from "@/app/[locale]/admin/actions";
import ConfirmSubmitButton from "./ConfirmSubmitButton";

export default function BusinessForm({
  locale,
  business,
  photos,
  action,
}: {
  locale: string;
  business?: Business;
  photos?: BusinessPhoto[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-5 rounded-2xl border border-stone bg-white p-6">
      <input type="hidden" name="locale" value={locale} />

      <Field label="Nombre">
        <input
          name="name"
          required
          defaultValue={business?.name}
          className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Categoría">
          <select
            name="category"
            defaultValue={business?.category ?? "experiencia"}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          >
            <option value="experiencia">Experiencia / tour</option>
            <option value="taller">Taller artesanal</option>
            <option value="transporte">Transporte</option>
            <option value="evento">Evento</option>
            <option value="hotel">Hotel</option>
            <option value="restaurante">Restaurante</option>
            <option value="comercio">Comercio</option>
          </select>
        </Field>
        <Field label="Zona">
          <input
            name="zone"
            defaultValue={business?.zone ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
      </div>

      <Field label="Descripción (español)">
        <textarea
          name="description_es"
          rows={3}
          defaultValue={business?.description_es ?? ""}
          className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
        />
      </Field>

      <Field label="Descripción (inglés)">
        <textarea
          name="description_en"
          rows={3}
          defaultValue={business?.description_en ?? ""}
          className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Teléfono">
          <input
            name="phone"
            defaultValue={business?.phone ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
        <Field label="WhatsApp (con indicativo)">
          <input
            name="whatsapp"
            placeholder="573001234567"
            defaultValue={business?.whatsapp ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
        <Field label="Rango de precio">
          <input
            name="price_range"
            placeholder="$ - $$$"
            defaultValue={business?.price_range ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Precio desde (en pesos, solo números)">
          <input
            type="number"
            name="price_from_cop"
            min={0}
            step={500}
            placeholder="45000"
            defaultValue={business?.price_from_cop ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
        <Field label="Horario">
          <input
            name="schedule"
            placeholder="8:00 am - 5:00 pm"
            defaultValue={business?.schedule ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
        <Field label="Duración">
          <input
            name="duration"
            placeholder="2 horas"
            defaultValue={business?.duration ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="El precio es">
          <select
            name="price_unit"
            defaultValue={business?.price_unit ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          >
            <option value="">(sin unidad)</option>
            <option value="persona">Por persona</option>
            <option value="noche">Por noche</option>
            <option value="entrada">Por entrada</option>
            <option value="pieza">Por pieza</option>
            <option value="trayecto">Por trayecto</option>
          </select>
        </Field>
        <Field label="Tipo de precio">
          <select
            name="price_type"
            defaultValue={business?.price_type ?? "fijo"}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          >
            <option value="fijo">Precio fijo (usa el valor en pesos)</option>
            <option value="voluntario">Pago voluntario</option>
            <option value="gratis">Gratis</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Link de Google Maps">
          <input
            name="map_url"
            placeholder="https://maps.google.com/..."
            defaultValue={business?.map_url ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
        <Field label="Sitio web">
          <input
            name="website"
            placeholder="https://..."
            defaultValue={business?.website ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
        <Field label="Instagram">
          <input
            name="instagram"
            placeholder="@usuario"
            defaultValue={business?.instagram ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
      </div>

      <Field label="Fuente de la investigación (uso interno)">
        <input
          name="source_url"
          placeholder="https://..."
          defaultValue={business?.source_url ?? ""}
          className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Estado (solo «Aprobado» se ve en público)">
          <select
            name="status"
            defaultValue={business?.status ?? "borrador"}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          >
            <option value="borrador">Borrador</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </Field>
        <Field label="Plan">
          <select
            name="plan"
            defaultValue={business?.plan ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          >
            <option value="">Sin plan</option>
            <option value="basico">Básico</option>
            <option value="destacado">Destacado</option>
            <option value="destacado_bilingue">Destacado bilingüe</option>
          </select>
        </Field>
        <Field label="Próximo pago">
          <input
            type="date"
            name="next_payment_due"
            defaultValue={business?.next_payment_due ?? ""}
            className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_sample"
            defaultChecked={business?.is_sample ?? false}
            className="h-4 w-4"
          />
          Negocio de ejemplo
        </label>
      </div>

      <Field label="Agregar fotos">
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
          className="w-full rounded-lg border border-stone px-3 py-2 outline-none focus:border-clay"
        />
      </Field>

      {photos && photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl(photo.storage_path)}
                alt=""
                className="aspect-square w-full rounded-lg object-cover"
              />
              <form action={deletePhoto} className="absolute right-1 top-1">
                <input type="hidden" name="photoId" value={photo.id} />
                <input type="hidden" name="storagePath" value={photo.storage_path} />
                <input type="hidden" name="businessId" value={business?.id} />
                <input type="hidden" name="locale" value={locale} />
                <ConfirmSubmitButton
                  confirmMessage="¿Eliminar esta foto?"
                  className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </ConfirmSubmitButton>
              </form>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-clay px-6 py-2.5 font-medium text-white hover:bg-clay-dark"
      >
        Guardar
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-foreground/80">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}
