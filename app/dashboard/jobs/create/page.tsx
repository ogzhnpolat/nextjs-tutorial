import Form from '@/app/ui/jobs/create-form';
import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import { fetchTeam, fetchTeamMembers } from '@/app/lib/data';

export default async function Page() {
    const team = await fetchTeam();
    const members = await fetchTeamMembers(team);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'İşler', href: '/dashboard/jobs' },
                    {
                        label: 'İş Emri Gir',
                        href: '/dashboard/jobs/create',
                        active: true,
                    },
                ]}
            />
            <Form members={members} team={team} />
        </main>
    );
}