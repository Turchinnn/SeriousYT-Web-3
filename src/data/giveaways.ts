// Shared giveaway data for the entire application
export interface Giveaway {
  id: number;
  title: string;
  description: string;
  endDate: string;
  participants: number;
  url: string;
  image: string;
  status?: "active" | "ending-soon" | "ended";
  value?: string;
  category?: string;
}

export const allGiveaways: Giveaway[] = [
  {
    id: 1,
    title: "CS2 - Navaja Knife",
    description: "Win a Navaja Knife | Stained! It comes in Minimal Wear type condition. Enter now for your chance to add it to your inventory!",
    endDate: "2025-10-03",
    participants: 5,
    url: "https://clash.gg/affiliate/creator/SERIOUS",
    image: "src/assets/navajastained.jpg",
    status: "ending-soon",
    value: "$100",
    category: "gaming"
  },
  {
    id: 2,
    title: "CS2 - Shadow Daggers",
    description: "Win Shadow Daggers | Blue Steel! These Factory New dual daggers feature the sleek Blue Steel finish. Enter now for your chance to add them to your inventory!",
    endDate: "2025-08-06",
    participants: 21,
    url: "https://gleam.io/example2",
    image: "src/assets/shadowdaggersbluesteel.png",
    status: "ended",
    value: "$200",
    category: "tech"
  },
  {
    id: 3,
    title: "CS2 - Flip Knife",
    description: "Win a Flip Knife | Black Laminate! It comes in Minimal Wear condition. Enter now for your chance to add it to your inventory!",
    endDate: "2025-08-24",
    participants: 18,
    url: "https://gleam.io/example3",
    image: "src/assets/flipknifeblacklaminate.png",
    status: "ended",
    value: "$150",
    category: "gaming"
  },
  {
    id: 4,
    title: "1x | $200 PayPal",
    description: "Be the most active in the chat and get a chance to win $150 sent straight to your PayPal!",
    endDate: "2025-09-17",
    participants: 219,
    url: "https://gleam.io/example4",
    image: "src/assets/cash3.jpg",
    status: "ended",
    value: "$200",
    category: "tech"
  },
  {
    id: 5,
    title: "2x | $150 Paypal",
    description: "Be the most active in the chat and get a chance to win $150 sent straight to your PayPal!",
    endDate: "2025-09-15",
    participants: 185,
    url: "https://gleam.io/example5",
    image: "src/assets/cash1.jpg",
    status: "ended",
    value: "$300",
    category: "gaming"
  },
  {
    id: 6,
    title: "Clash.gg - Free Battle",
    description: "Join our free Case Battle on Clash.gg! Watch the Serious channel live streams and follow along to participate and win awesome rewards.",
    endDate: "2025-08-02",
    participants: 179,
    url: "https://clash.gg",
    image: "src/assets/clashggfree.jpg_large",
    status: "active",
    value: "$9",
    category: "tech"
  }
];

// Helper function to get active giveaways for homepage
export const getActiveGiveaways = (limit?: number): Giveaway[] => {
  const active = allGiveaways.filter(g => g.status === "active" || g.status === "ending-soon");
  return limit ? active.slice(0, limit) : active;
};

// Helper function to get ended giveaways
export const getEndedGiveaways = (): Giveaway[] => {
  return allGiveaways.filter(g => g.status === "ended");
};