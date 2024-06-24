import { lusitana } from "@/app/ui/fonts";
import { PencilIcon, TruckIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const data = {
    name: 'Sürat Kargo Atakum',
    address: 'Denizevleri mahallesi, yarak kürek sokak, falan filan',
    region: 'Samsun',
    zone: 'Atakum',
    country: 'Turkey',
    user_count: '5',
    vehicle_count: '2',
}

export default async function Page() {

    return (
        <div className="w-full space-y-5">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Store Ekranı</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <div className="relative flex flex-1 flex-shrink-0 bg-gray-50 p-2 rounded-lg">
                    {data.name}
                </div>
                <EditStore />
            </div>
            <div className="grid space-y-1 bg-gray-50 p-2 rounded-lg">
                <div className="">
                    {data.address}
                </div>
                <div className="">
                    {data.zone} / {data.region}
                </div>
                <div className="">
                    {data.country}
                </div>
            </div>
            <div className="flex space-x-5 bg-gray-50 p-2 rounded-lg">
                <UserCount count={data.user_count} />
                <VehicleCount count={data.vehicle_count} />
            </div>
        </div>
    )
}

function EditStore() {
    return (
        <Link
            href="/dashboard/jobs/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Düzenle</span>{' '}
            <PencilIcon className="h-5 md:ml-4" />
        </Link>
    );
}

function UserCount({ count } : {count: string} ) {
    return (
        <div className="flex">
            <UserIcon className="h-5 md:ml-4" />
            <p>: { count }</p>
        </div>
    )
}

function VehicleCount({ count }: { count: string }) {
    return (
        <div className="flex">
            <TruckIcon className="h-5 md:ml-4" />
            <p>: {count}</p>
        </div>
    )
}