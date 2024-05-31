import { UpdateJob, DeleteJob, JobDetails } from '@/app/ui/jobs/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredJobs } from '@/app/lib/data';
import { TruckIcon } from '@heroicons/react/24/outline';
import JobStatus from '@/app/ui/invoices/status';

export default async function JobsTable({
  query,
  team,
  currentPage,
}: {
  query: string;
  team: string;
  currentPage: number;
}) {
  const jobs = await fetchFilteredJobs(query, team, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {jobs?.map((job) => (
              <div
                key={job.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <TruckIcon className="h-6 w-6 text-gray-500 mr-2" />
                      <p>{job.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{job.from_user}</p>
                  </div>
                  <JobStatus status={job.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      123123123
                    </p>
                    <p>{formatDateToLocal(job.date_created)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <JobDetails id={job.id} />
                    <UpdateJob id={job.id} />
                    <DeleteJob id={job.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  İş Adı
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  İş Veren
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  İş Alan
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Tarih
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Durum
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Eylemler</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {jobs?.map((job) => (
                <tr
                  key={job.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <TruckIcon className="h-6 w-6 text-gray-500 mr-2" />
                      <p>{job.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {job.from_user}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {job.to_user}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(job.date_created)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <JobStatus status={job.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <JobDetails id={job.id} />
                      <UpdateJob id={job.id} />
                      <DeleteJob id={job.id} />
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
