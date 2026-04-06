import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ReferenceDot } from "recharts";
import { motion, animate } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, prefix = "" }: { value: number, prefix?: string }) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        setDisplayValue(Math.round(v).toLocaleString());
      }
    });
    return () => controls.stop();
  }, [value]);

  return <>{prefix}{displayValue}</>;
}

function Sparkline({ data, color }: { data: {v: number}[], color: string }) {
  return (
    <div className="w-[60px] h-[24px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard() {
  const { transactions } = useStore();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Process data for AreaChart (last 30 days balance trend mock)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let currentBalance = 0;
  const areaData = sortedTransactions.map(t => {
    currentBalance += t.type === "income" ? t.amount : -t.amount;
    return {
      date: format(parseISO(t.date), "MMM dd"),
      balance: currentBalance
    };
  });

  const lowestDataPoint = areaData.length > 0 ? areaData.reduce((min, p) => p.balance < min.balance ? p : min, areaData[0]) : null;

  // Mock data for sparklines
  const sparklineData = {
    balance: [{v: 10}, {v: 12}, {v: 11}, {v: 14}, {v: 15}, {v: 13}, {v: 18}],
    income: [{v: 5}, {v: 7}, {v: 6}, {v: 8}, {v: 9}, {v: 10}, {v: 12}],
    expense: [{v: 20}, {v: 18}, {v: 15}, {v: 12}, {v: 10}, {v: 8}, {v: 5}],
  };

  // Process data for PieChart (expenses by category)
  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  })).sort((a,b) => b.value - a.value);

  const CATEGORY_COLORS: Record<string, string> = {
    "Housing": "#6366f1",
    "Shopping": "#8b5cf6",
    "Food & Dining": "#06b6d4",
    "Entertainment": "#f59e0b",
    "Transportation": "#10b981",
  };

  const getCategoryColor = (name: string) => CATEGORY_COLORS[name] || "#94a3b8";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border/50 p-3 rounded-xl shadow-xl">
          <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
          <p className="tabular-nums text-lg font-bold text-foreground">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Your financial summary at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-sm relative overflow-hidden group transition-transform duration-150 ease hover:-translate-y-[2px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-[#f59e0b]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="tabular-nums text-3xl font-bold"><AnimatedCounter value={balance} prefix="$" /></div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-primary flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +14.5% from last month
              </p>
              <Sparkline data={sparklineData.balance} color="#6366f1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm relative overflow-hidden group transition-transform duration-150 ease hover:-translate-y-[2px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#047857]/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-[#047857]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="tabular-nums text-3xl font-bold text-[#047857]"><AnimatedCounter value={totalIncome} prefix="$" /></div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground flex items-center">
                Across all income streams
              </p>
              <Sparkline data={sparklineData.income} color="#10b981" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm relative overflow-hidden group transition-transform duration-150 ease hover:-translate-y-[2px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#b91c1c]/10 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-[#b91c1c]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="tabular-nums text-3xl font-bold text-[#b91c1c]"><AnimatedCounter value={totalExpense} prefix="$" /></div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Top category: {pieData[0]?.name || "N/A"}
              </p>
              <Sparkline data={sparklineData.expense} color="#ef4444" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
            <CardDescription>Your balance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={20} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} fillOpacity={0.12} fill="#6366f1" />
                  {lowestDataPoint && (
                    <ReferenceDot 
                      x={lowestDataPoint.date} 
                      y={lowestDataPoint.balance} 
                      r={5} 
                      fill="#ef4444" 
                      stroke="none"
                      label={(props: any) => (
                        <g>
                          <rect x={props.x - 55} y={props.y - 28} width={110} height={20} fill="white" rx={10} stroke="#e8e6df" strokeWidth={1} />
                          <text x={props.x} y={props.y - 14} fill="#6b6b9a" fontSize={11} fontWeight={500} textAnchor="middle">Rent + Apple Store</text>
                        </g>
                      )} 
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const val = payload[0].value as number;
                          const percentage = ((val / totalExpense) * 100).toFixed(0);
                          return (
                            <div className="bg-card/90 backdrop-blur-md border border-border/50 p-2 px-3 rounded-lg shadow-xl flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                              <span className="font-medium text-sm">{payload[0].name}</span>
                              <span className="text-muted-foreground text-xs mx-1">&middot;</span>
                              <span className="tabular-nums font-bold text-sm">{percentage}%</span>
                              <span className="text-muted-foreground text-xs mx-1">&middot;</span>
                              <span className="tabular-nums font-bold ml-1">${val.toLocaleString()}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground">No expenses to show</div>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              {pieData.slice(0, 4).map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(entry.name) }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
