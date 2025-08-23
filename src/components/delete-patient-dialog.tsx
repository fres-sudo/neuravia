"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface DeletePatientDialogProps {
  patientId: string;
  patientName: string;
}

export default function DeletePatientDialog({ patientId, patientName }: DeletePatientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();

  const deletePatientMutation = api.patients.delete.useMutation({
    onSuccess: () => {
      toast.success("Patient deleted successfully");
      utils.patients.fetch.invalidate();
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete patient");
    },
  });

  const handleDelete = () => {
    deletePatientMutation.mutate({ patientId });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="absolute top-4 right-16 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Patient</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{patientName}</strong>? This action cannot be undone and will permanently remove all associated data including diaries, settings, and uploaded images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePatientMutation.isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {deletePatientMutation.isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
