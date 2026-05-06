import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ConfirmPaymentModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    processing?: boolean;
}

export default function ConfirmPaymentModal({ 
    isOpen, 
    setIsOpen, 
    title, 
    description, 
    onConfirm, 
    processing 
}: ConfirmPaymentModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                    <Button 
                        type="button" 
                        variant="default" 
                        onClick={() => {
                            onConfirm();
                        }} 
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Bayar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
