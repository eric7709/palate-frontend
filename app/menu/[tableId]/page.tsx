import Base from '@/screens/menu/Base'

interface PageProps {
  params: {
    tableId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { tableId } = await params;
  return <Base tableId={tableId} />
}