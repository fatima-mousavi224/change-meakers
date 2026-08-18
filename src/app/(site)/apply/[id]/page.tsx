import { redirect } from "next/navigation";

type ApplyDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ApplyDetailPage({ params }: ApplyDetailPageProps) {
  redirect(`/opportunities/${encodeURIComponent(params.id)}`);
}
