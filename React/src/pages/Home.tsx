import { Charts } from "@/components/Charts";
import CardDashboard from "@/components/CardDashborad";
import GoofyCard from "@/components/GoofyCard";

const Home = () => (
  <div className="pt-0 p-4 flex flex-col gap-4 h-full">
    <Charts height="30vh" />
    <div className="flex flex-col md:flex-row justify-between gap-4 h-full">
      <CardDashboard title="1267 $" description="the current price of ETH" />
      <CardDashboard
        title="9.276 ETH"
        description="the current balance of your wallet"
      />
      <GoofyCard />
    </div>
  </div>
);

export default Home;
