"use client";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bitcoin,
  Coins,
  Gem,
  MoreVertical,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CryptoAsset {
  name: string;
  ticker: string;
  apy: string;
  value: string;
  change: string;
  isPositive: boolean;
  allocation: number;
  color: string;
}

const cryptoAssets: CryptoAsset[] = [
  {
    name: "Bitcoin",
    ticker: "BTC",
    apy: "1.5% APY",
    value: "$64,250.00",
    change: "4.85%",
    isPositive: true,
    allocation: 55,
    color: "bg-primary",
  },
  {
    name: "Ethereum",
    ticker: "ETH",
    apy: "4.2% APY",
    value: "$3,450.00",
    change: "2.10%",
    isPositive: true,
    allocation: 30,
    color: "bg-secondary",
  },
  {
    name: "Solana",
    ticker: "SOL",
    apy: "7.5% APY",
    value: "$145.00",
    change: "1.25%",
    isPositive: false,
    allocation: 15,
    color: "bg-muted",
  },
];

export const Finance1 = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md border">
            <ShieldCheck className="size-4.5" />
          </div>
          <CardTitle>Secure Vault</CardTitle>
        </div>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="cursor-pointer"
                >
                  <MoreVertical className="size-4" />
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                <RefreshCw className="size-3.5" />
                <span>Refresh Rates</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="bg-muted/40 grid grid-cols-[1fr_auto] gap-4 rounded-md border p-3">
          <div className="space-y-0.5">
            <p className="text-2xl font-semibold">
              <span className="text-muted-foreground me-0.5 align-super text-base font-medium">
                $
              </span>
              87,420
            </p>
            <p className="text-muted-foreground text-xs">
              Total holdings valuation
            </p>
          </div>
          <Badge>
            <ArrowUpRight className="size-3" />
            <span>+3.45%</span>
          </Badge>
        </div>
        <div className="grid gap-2">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Allocation</span>
            <span>100% Total</span>
          </div>
          <div className="bg-muted flex h-2 w-full gap-0.5 overflow-hidden rounded-md">
            {cryptoAssets.map((asset) => (
              <div
                key={asset.ticker}
                style={{ width: `${asset.allocation}%` }}
                className={`h-full ${asset.color}`}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {cryptoAssets.map((asset) => (
            <div key={asset.ticker} className="grid gap-2">
              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-primary flex size-10 items-center justify-center rounded-md">
                    {asset.ticker === "BTC" ? (
                      <Bitcoin className="size-5" />
                    ) : asset.ticker === "ETH" ? (
                      <Gem className="size-5" />
                    ) : (
                      <Coins className="size-5" />
                    )}
                  </div>
                  <div className="grid gap-0.5">
                    <span className="text-sm font-medium">{asset.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {asset.ticker} • {asset.apy}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium">{asset.value}</span>
                  <span
                    className={`flex items-center justify-center gap-0.5 text-xs ${
                      asset.isPositive ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {asset.isPositive ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    <span>{asset.change}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
