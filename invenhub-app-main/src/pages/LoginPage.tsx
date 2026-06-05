import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/store";
import { toast } from "sonner";
import { Boxes } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await auth.login(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
            IP
          </div>
          <span className="font-semibold">Inventory MVP Pro</span>
        </div>
        <div>
          <Boxes className="h-12 w-12 mb-6 text-sidebar-primary" />
          <h2 className="text-3xl font-semibold leading-tight">Run your inventory like a pro.</h2>
          <p className="mt-3 text-sm opacity-70 max-w-md">
            Track products, stock, sales and purchases in one elegant dashboard.
          </p>
        </div>
        <div className="text-xs opacity-50"> © {new Date().getFullYear()} Inventory MVP Pro </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email and password to access your inventory dashboard.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            No account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
