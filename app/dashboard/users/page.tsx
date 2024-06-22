import Pagination from '@/app/ui/users/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/users/table';
import { CreateInvoice } from '@/app/ui/users/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchTeam, fetchTeamMembersPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanıcılar',
}

export default async function Page({
  searchParams,
} : {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const team = await fetchTeam();

  const totalPages = await fetchTeamMembersPages(query, team);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Kullanıcılar</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Kullanıcı Ara..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} team={team} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}