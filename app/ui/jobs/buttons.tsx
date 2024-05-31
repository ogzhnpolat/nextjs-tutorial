import { deleteJob, updateDeliveryStatus } from '@/app/lib/actions/jobs';
import { CheckIcon, EyeIcon, MapPinIcon, PencilIcon, PhoneIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export function CreateJob() {
  return (
    <Link
      href="/dashboard/jobs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">İş Oluştur</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function JobDetails({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/jobs/${id}`} className="rounded-md border p-2 hover:bg-gray-100">
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function UpdateJob({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/jobs/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteJob({ id }: { id: string }) {
  const deleteJobWithId = deleteJob.bind(null, id);

  return (
    <>
      <form action={deleteJobWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Sil</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}

export function GetDirection({ address }: { address: string }) {
  return (
    <Link
      href={`https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=driving&dir_action=navigate`}
      className="rounded-md border p-2 hover:bg-gray-100"
      target='_blank'
    >
      <MapPinIcon className="w-5" />
    </Link>
  );
}

export function CallCustomer({ phone }: { phone: string }) {
  return (
    <a href={`tel:${phone}`} className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Ara</span>
      <PhoneIcon className="w-5" />
    </a>
  );
}

export function CompleteDelivery({ id, job_id }: { id: string, job_id: string }) {
  const updateJobWithId = updateDeliveryStatus.bind(null, id, job_id, 'done');

  revalidatePath(`/dashboard/jobs/${job_id}`);

  return (
    <form action={updateJobWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Tamamla</span>
        <CheckIcon className="w-5" />
      </button>
    </form>
  );
}

export function CancelDelivery({ id, job_id }: { id: string, job_id: string }) {
  const updateJobWithId = updateDeliveryStatus.bind(null, id, job_id, 'canceled');

  return (
    <form action={updateJobWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">İptal</span>
        <XMarkIcon className="w-5" />
      </button>
    </form>
  );
}