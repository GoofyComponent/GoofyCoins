import { use, useEffect, useState } from "react";
import { Charts } from "@/components/Charts";
import CardDashboard from "@/components/CardDashborad";
import GoofyCard from "@/components/GoofyCard";
import { Loader } from "lucide-react";
import { API } from "@/services/api";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

interface EthStats {
  ethPrice: number;
  balanceEth: string;
  balanceUsd: number;
  address: string;
}

interface EthBalance {
  date: string;
  eth: number;
}

interface PriceData {
  date: string;
  usd: number;
}

const Home = () => {
  const { user } = useAuth();
  const [ethStats, setEthStats] = useState<EthStats | null>(null);
  const [ethBalances, setEthBalances] = useState<EthBalance[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    const fetchEthStats = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.get<EthStats>("/eth/stats");
        if (response.data) {
          setEthStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching ETH stats:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch ETH stats.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchEthBalances = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const formattedStartDate = startDate.toISOString().split("T")[0];

        const response = await API.get(
          `/eth/balances/${formattedStartDate}/${endDate}`
        );
        if (response.data) {
          const today = new Date();
          const formattedBalances: EthBalance[] = Array.from({ length: 15 })
            .map((_, i) => {
              const date = new Date();
              date.setDate(today.getDate() - i);
              const formattedDate = date.toISOString().split("T")[0];

              // Récupérer les valeurs de la réponse pour la date correspondante
              const values = response.data[formattedDate] || {};
              return {
                date: formattedDate,
                eth: parseFloat(values.eth) || 0,
              };
            })
            .reverse(); // Inverser l'ordre pour avoir les dates croissantes

          setEthBalances(formattedBalances);
        }
      } catch (err) {
        console.error("Error fetching ETH balances:", err);
        setError("Failed to fetch ETH balances.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPriceData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get("/last-30-days-prices");
        if (response.data) {
          const today = new Date();
          const formattedData: PriceData[] = Array.from({ length: 15 }).map(
            (_, i) => {
              const date = new Date();
              date.setDate(today.getDate() - i);
              const formattedDate = date.toISOString().split("T")[0];

              // Remplacer simplement la date pour affichage dans le graphique
              const values = response.data[Object.keys(response.data)[i]] || {};
              return {
                date: formattedDate,
                eth: parseFloat(values.eth) || 0,
                usd: values.usd || 0,
                eur: values.eur || 0,
                eth_usd_price: values.eth_usd_price || 0,
                eth_eur_price: values.eth_eur_price || 0,
              };
            }
          );

          setPriceData(formattedData);
        }
      } catch (err) {
        console.error("Error fetching price data:", err);
        setError("Failed to fetch price data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEthStats(),
        fetchEthBalances(),
        fetchPriceData(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader className="w-8 h-8 animate-spin opacity-30" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  return (
    <div className="pt-0 p-4 flex flex-col gap-4 h-full">
      <Charts height="30vh" />
      <div className="flex flex-col md:flex-row justify-between gap-4 h-full">
        {ethStats && (
          <>
            <CardDashboard
              title={`${ethStats.ethPrice.toFixed(2)} $`}
              description="The current price of ETH"
              chartData={priceData.map(({ date, usd }) => ({
                date,
                value: usd,
              }))}
              dataKey="value"
            />
            <CardDashboard
              title={`${parseFloat(ethStats.balanceEth).toFixed(4)} ETH`}
              description={`Balance in your wallet:`}
              chartData={ethBalances.map(({ date, eth }) => ({
                date,
                value: eth,
              }))}
              dataKey="value"
            />
          </>
        )}
        <GoofyCard />
      </div>
    </div>
  );
};

export default Home;
