import { ArrowPathIcon, CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function JobStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'done',
          'bg-blue-500 text-white': status === 'active',
          'bg-red-500 text-white': status === 'canceled',
        },
      )}
    >
      {status === 'active' ? (
        <>
          Active
          <ArrowPathIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'canceled' ? (
        <>
          Canceled
          <XMarkIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'done' ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
