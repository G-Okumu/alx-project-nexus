import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export default function CheckOut() {
    const { items, itemCount, total } = useCartStore();

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardTitle className="p-4 flex items-center text-sm">Payment Method <span className="text-xs pl-4 text-muted-foreground">( Trusted Payment. )</span></CardTitle>
                <CardContent>
                    <div className="border p-4 flex flex-row gap-x-10 items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1280px-M-PESA_LOGO-01.svg.png" alt="mpesa logo" height={100} width={100} />

                        <p className="font-bold">Cards, M-PESA, Bank Transfers or Mobile Money</p>

                        <Checkbox checked />
                    </div>
                </CardContent>
            </Card>


            <Card className="mt-4">
                <CardTitle className="p-4 flex items-center">Product List <span className="text-xs pl-4 text-muted-foreground">Summary ( {itemCount} items )</span></CardTitle>
                {items.map((item) => (
                    <CardContent className="p-4">
                        <div className="grid gap-4 grid-cols-3 items-center">
                            {/* Product Image */}
                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />

                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">
                                        {item.product.name}
                                    </h3>
                                </div>
                            </div>


                            <div>
                                {item.product.brand && (
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {item.product.brand}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">
                                    Ksh.{item.product.price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                ))}
            </Card>

            <Card className="mt-4">
                <CardContent className="grid grid-cols-2 p-6">
                    <div>
                        <p className="bg-warning w-32 text-center rounded-md pb-2">7 Days</p>
                        <p>Money Back Guarantee</p>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm font-bold">
                            <span>Product Amount</span>
                            <span>Ksh.{(total * 1.08).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm">Shipping Fee</span>
                            <span className="text-success">Free</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-sm">Tax</span>
                            <span>Ksh.{(total * 0.08).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm font-bold py-2">
                            <span className="text-sm">Payment Amount</span>
                            <span className="text-destructive">Ksh.{(total * 1.08).toFixed(2)}</span>
                        </div>

                        <Button className="w-full bg-destructive" size="lg">
                            Place Order
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}