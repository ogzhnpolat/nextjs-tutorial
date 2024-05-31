
import Form from '@/app/ui/settings/edit-form'
import Breadcrumbs from '@/app/ui/common/breadcrumbs'

import { notFound } from 'next/navigation';
import { fetchUserSettings } from '@/app/lib/data';


export default async function Page() {
    
    // in this page we will fetch the user settings and pass them to the form
    const user = await fetchUserSettings();

    if (!user) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard' },
                    { label: 'Settings', href: `/dashboard/settings`, active: true },
                ]}
            />
            <Form user={user} />
        </main>
    )
}