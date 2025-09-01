"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "./ui/dialog"
import { Input } from "@/components/ui/input";

interface SideBarProps {
    open: boolean,
    setIsOpen: (open: boolean) => void, // ye kya
}

export function SideBarAdd({ open, setIsOpen }: SideBarProps) {
    return (
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
         
              This is a simple dialog box example.
           
          <p className="text-sm text-muted-foreground">
            You can put any content here.
          </p>
        </DialogContent>
      </Dialog>
    );
}
