import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./Button";

// this is just an example
export function Modal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open me</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col bg-white items-center gap-2">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
            necessitatibus sunt ad cum corrupti nostrum mollitia assumenda dolor
            architecto est odio corporis magnam, ut, iste libero. Illo, itaque
            ad. At.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
