import { UpdateJob, DeleteJob, GetDirection } from '@/app/ui/jobs/buttons';
import { TruckIcon } from '@heroicons/react/24/outline';
import JobStatus from '@/app/ui/jobs/status';

export default async function JobDetailsTable({ deliveries }: { deliveries: any }) {

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {deliveries?.map((delivery) => (
              <div
                key={delivery.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <TruckIcon className="h-6 w-6 text-gray-500 mr-2" />
                      <p>{delivery.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{delivery.address}</p>
                  </div>
                  <JobStatus status={delivery.staus} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {/* phone number link */}
                      <a href={`tel:${delivery.phone}`} className="text-blue-600">
                        {delivery.phone}
                      </a>
                    </p>
                    <p>{delivery.barcode}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <GetDirection address={`${delivery.latitude},${delivery.longitude}`} />
                    <UpdateJob id={delivery.id} />
                    <DeleteJob id={delivery.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Müşteri
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Adres
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Telefon
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Barkod
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Durum
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Eylem</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {deliveries?.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <TruckIcon className="h-6 w-6 text-gray-500 mr-2" />
                      <p>{delivery.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 max-w-xs truncate">
                    {delivery.address}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <a href={`tel:${delivery.phone}`} className="text-blue-600">
                      {delivery.phone}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {delivery.barcode}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <JobStatus status={delivery.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <GetDirection address={`${delivery.latitude},${delivery.longitude}`} />
                      <UpdateJob id={delivery.id} />
                      <DeleteJob id={delivery.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
