import { useStore } from "@/store/useStore";
import type { TransactionType } from "@/data/mockData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ArrowUpDown } from "lucide-react";

export default function Transactions() {
  const { transactions, role, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  const { editTransaction } = useStore();

  const handleSave = () => {
    if (editingId) {
      editTransaction(editingId, editForm);
      setEditingId(null);
    }
  };

  const filteredTransactions = transactions
    .filter(t => (filterType === "all" ? true : t.type === filterType))
    .filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const toggleSort = () => setSortOrder(prev => prev === "desc" ? "asc" : "desc");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground mt-1">Manage and view your financial activity.</p>
        </div>
        
        {role === "admin" && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        )}
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or category..." 
                className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                {["all", "income", "expense"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full capitalize transition-colors border ${
                      filterType === type 
                        ? "bg-[#f59e0b] border-[#f59e0b] text-[#1c1917]" 
                        : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                     {type}
                  </button>
                ))}
              </div>
              
              <Button variant="outline" className="bg-background/50 border-border/50 shrink-0" onClick={toggleSort}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortOrder === "desc" ? "Newest" : "Oldest"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="pl-6 font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="text-right font-semibold">Amount</TableHead>
                {role === "admin" && <TableHead className="text-right pr-6 font-semibold w-[120px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t, index) => (
                    <motion.tr 
                      key={t.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.06 }}
                      className="border-border hover:bg-[#f59e0b]/[0.08] group transition-all duration-[120ms] ease-in-out"
                    >
                      {editingId === t.id ? (
                         <>
                          <TableCell className="pl-6 w-[140px]">
                            <Input 
                              type="date"
                              value={editForm.date ? editForm.date.split("T")[0] : ""} 
                              onChange={e => setEditForm({...editForm, date: new Date(e.target.value).toISOString()})} 
                              className="h-8 text-xs bg-background/50" 
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={editForm.name || ""} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})} 
                              className="h-8 text-xs bg-background/50 w-full" 
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={editForm.category || ""} 
                              onChange={e => setEditForm({...editForm, category: e.target.value})} 
                              className="h-8 text-xs bg-background/50 w-full" 
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={editForm.type} onValueChange={(val: any) => setEditForm({...editForm, type: val})}>
                              <SelectTrigger className="h-8 text-xs bg-background/50 w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input 
                              type="number" 
                              value={editForm.amount || 0} 
                              onChange={e => setEditForm({...editForm, amount: Number(e.target.value)})} 
                              className="h-8 text-xs text-right bg-background/50 w-[100px] inline-flex" 
                            />
                          </TableCell>
                          {role === "admin" && (
                            <TableCell className="text-right pr-6">
                              <div className="flex items-center justify-end gap-3">
                                <button onClick={handleSave} className="text-[#f59e0b] text-[12px] font-bold hover:underline">Save</button>
                                <button onClick={() => setEditingId(null)} className="text-muted-foreground text-[12px] hover:underline">Cancel</button>
                              </div>
                            </TableCell>
                          )}
                         </>
                      ) : (
                         <>
                          <TableCell className="pl-6 text-muted-foreground whitespace-nowrap border-l-[2px] border-l-transparent group-hover:border-l-[#f59e0b] transition-colors duration-[120ms]">
                            {format(parseISO(t.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-background/40 border-border/50 text-xs font-normal">
                              {t.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`border-none rounded-full px-2.5 py-0.5 ${
                                t.type === "income" 
                                  ? "text-income-text bg-income-bg" 
                                  : "text-expense-text bg-expense-bg"
                              }`}
                            >
                              {t.type === "income" ? "Income" : "Expense"}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-bold tabular-nums ${t.type === "income" ? "text-[#047857]" : "text-[#b91c1c]"}`}>
                            {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          
                          {role === "admin" && (
                            <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button onClick={() => { setEditingId(t.id); setEditForm(t); }} className="text-muted-foreground text-[12px] hover:underline font-medium">Edit</button>
                                  <button onClick={() => deleteTransaction(t.id)} className="text-red-500 text-[12px] hover:underline font-medium">Delete</button>
                                </div>
                            </TableCell>
                          )}
                         </>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={role === "admin" ? 6 : 5} className="text-center py-10 text-muted-foreground">
                      No transactions found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
