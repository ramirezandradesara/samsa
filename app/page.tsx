import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 bg-zinc-50 px-4 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-flamingo">Samsa</h1>
        <p>Your reading companion</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-1">
        <Label htmlFor="book">Book</Label>
        <Input
          id="book"
          type="text"
          name="book"
          placeholder="e.g.: Frankenstein"
          autoComplete="off"
        />

        <Button type="submit">Search</Button>
      </div>
    </div>
  );
}
