import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertTriangle, ArrowUpRight, Clock, Target } from "lucide-react";
import { parseISO, subDays, getDaysInMonth, getDate } from "date-fns";

export default function Insights() {
  const { transactions } = useStore();

  const expenses = transactions.filter(t => t.type === "expense");
  const income = transactions.filter(t => t.type === "income");

  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const currentBalance = totalIncome - totalExpense;

  // Process data for category insights
  const expensesByCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  })).sort((a,b) => b.value - a.value);

  const highestCategory = sortedCategories[0];

  // Compare last 15 days vs previous 15 days
  const today = new Date();
  const fifteenDaysAgo = subDays(today, 15);
  
  // Projected End of Month Balance
  const daysInMonth = getDaysInMonth(today);
  const currentDay = getDate(today);
  const remainingDays = daysInMonth - currentDay;
  
  const recentExpenses = expenses.filter(t => parseISO(t.date) >= fifteenDaysAgo).reduce((acc, t) => acc + t.amount, 0);
  const olderExpenses = expenses.filter(t => parseISO(t.date) < fifteenDaysAgo).reduce((acc, t) => acc + t.amount, 0);
  
  const expenseChange = olderExpenses > 0 ? ((recentExpenses - olderExpenses) / olderExpenses) * 100 : 0;

  // Avg daily spend based on last 15 days
  const avgDailySpend = recentExpenses / 15;
  const projectedBalance = currentBalance - (avgDailySpend * remainingDays);

  // Top 3 recurring merchants
  const merchantCounts = expenses.reduce((acc, t) => {
    if (!acc[t.name]) { acc[t.name] = { count: 0, total: 0 }; }
    acc[t.name].count += 1;
    acc[t.name].total += t.amount;
    return acc;
  }, {} as Record<string, { count: number, total: number }>);

  const topMerchants = Object.entries(merchantCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  // Velocity Segments
  const recentCategories = expenses.filter(t => parseISO(t.date) >= fifteenDaysAgo).reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount; return acc;
  }, {} as Record<string, number>);

  const olderCategories = expenses.filter(t => parseISO(t.date) < fifteenDaysAgo).reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount; return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#8b5cf6', '#0ea5e9', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#10b981'];
  const allCatNames = Array.from(new Set([...Object.keys(recentCategories), ...Object.keys(olderCategories)]));
  const categoryColors = allCatNames.reduce((acc, name, i) => { acc[name] = COLORS[i % COLORS.length]; return acc; }, {} as Record<string, string>);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pb-8"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
        <p className="text-muted-foreground mt-1 text-sm">Actionable intelligence based on your recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div>
          <Card className="bg-[#f59e0b] border-[#f59e0b] text-[#1c1917] shadow-xl overflow-hidden relative transition-transform duration-150 ease hover:-translate-y-[2px] h-full flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lightbulb className="w-24 h-24 text-[#1c1917]" />
            </div>
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-[#1c1917]/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-[#1c1917]" />
              </div>
              <CardTitle className="text-xl">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-end flex-1">
              <div className="tabular-nums text-4xl font-black text-[#1c1917]">
                {savingsRate.toFixed(1)}%
              </div>
              <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
                Income ${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} − Expenses ${totalExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })} = ${(totalIncome - totalExpense).toLocaleString(undefined, { maximumFractionDigits: 0 })} saved ({savingsRate.toFixed(1)}%)
              </p>
              <p className="mt-4 text-[#1c1917]/80 text-sm">
                {savingsRate > 20 ? "Great job! You're above the recommended 20% threshold." : "Consider reducing discretionary spending to boost your savings rate."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div>
          <Card className="bg-card border-border shadow-sm h-full transition-transform duration-150 ease hover:-translate-y-[2px] flex flex-col">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="text-xl">Projected End of Month</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-end flex-1">
               <div className="tabular-nums text-4xl font-bold text-emerald-500">
                ${projectedBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="mt-2 text-muted-foreground text-sm font-medium">
                At this rate, you'll end the month at ${projectedBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div>
          <Card className="bg-card border-border shadow-sm h-full transition-transform duration-150 ease hover:-translate-y-[2px] flex flex-col">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <CardTitle className="text-xl">Highest Expense Area</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-end flex-1">
               <div className="text-3xl font-bold text-foreground">
                {highestCategory?.name || "N/A"}
              </div>
              <p className="mt-2 text-muted-foreground text-sm flex items-center gap-1">
                You've spent <span className="tabular-nums font-bold text-destructive">${highestCategory?.value.toLocaleString()}</span> on this category.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div>
          <Card className="bg-card border-border shadow-sm h-full transition-transform duration-150 ease hover:-translate-y-[2px] flex flex-col">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <CardTitle className="text-xl">Top Recurring Merchants</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-end">
              <div className="space-y-4">
                {topMerchants.map(([name, stats], index) => (
                  <div key={name} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="font-semibold text-sm">{index + 1}. {name}</p>
                      <p className="text-xs text-muted-foreground">{stats.count} transactions</p>
                    </div>
                    <p className="font-bold tabular-nums text-sm">${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div className="md:col-span-2">
           <Card className="bg-card border-border shadow-sm relative overflow-hidden group transition-transform duration-150 ease hover:-translate-y-[2px]">
            <CardHeader>
              <CardTitle>Spending Velocity</CardTitle>
              <CardDescription>Segmented comparison: Last 15 Days vs Previous 15 Days</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Recent (Last 15 days)</span>
                  <span className="tabular-nums font-bold">${recentExpenses.toLocaleString()}</span>
                </div>
                 <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                  <div className="flex h-full" style={{ width: `${Math.min((recentExpenses / (recentExpenses + olderExpenses || 1)) * 100, 100)}%` }}>
                    {Object.entries(recentCategories).map(([cat, amount]) => (
                      <div key={cat} style={{ width: `${(amount / recentExpenses) * 100}%`, backgroundColor: categoryColors[cat] }} title={`${cat}: $${amount}`} className="h-full" />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6 mb-2">
                  <span className="text-sm font-medium">Older (Previous 15 days)</span>
                  <span className="tabular-nums font-bold">${olderExpenses.toLocaleString()}</span>
                </div>
                 <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                  <div className="flex h-full" style={{ width: `${Math.min((olderExpenses / (recentExpenses + olderExpenses || 1)) * 100, 100)}%` }}>
                    {Object.entries(olderCategories).map(([cat, amount]) => (
                      <div key={cat} style={{ width: `${(amount / olderExpenses) * 100}%`, backgroundColor: categoryColors[cat] }} title={`${cat}: $${amount}`} className="h-full opacity-80" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-32 text-center p-4 bg-background/50 rounded-xl border border-border/50 backdrop-blur-md shrink-0">
                <div className={`tabular-nums text-2xl font-black ${expenseChange > 0 ? 'text-destructive' : 'text-emerald-500'} flex items-center justify-center`}>
                  {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(0)}%
                  {expenseChange > 0 ? <ArrowUpRight className="h-5 w-5 ml-1" /> : <TrendingUp className="h-5 w-5 ml-1 rotate-180" />}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Change</div>
              </div>
            </CardContent>
            
            <div className="px-6 pb-6 pt-2">
               <div className="flex flex-wrap gap-4 text-xs justify-center items-center border-t border-border/50 pt-4">
                 {allCatNames.map(cat => (
                   <div key={cat} className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border/50">
                     <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: categoryColors[cat] }} />
                     <span className="text-muted-foreground font-medium">{cat}</span>
                   </div>
                 ))}
               </div>
            </div>

          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
