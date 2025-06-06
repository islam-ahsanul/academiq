import FilterBar from '@/components/navbars/FilterBar';
import { FeedNavbar } from '@/components/navbars/FeedNavBar';
import TrendingPosts from '@/components/navbars/TrendingPosts';

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col min-h-screen">
			<FeedNavbar />
			<div className="flex flex-row pt-16">
				<FilterBar />
				<div className="flex-1 mx-64 p-6">{children}</div>
				<TrendingPosts />
			</div>
		</main>
	);
};

export default FeedLayout;
