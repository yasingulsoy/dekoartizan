"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BreadcrumbCheckout from "@/components/checkout-page/BreadcrumbCheckout";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import { FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "credit-card",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingData({
      ...billingData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ödeme işlemi burada yapılacak
    console.log("Checkout:", { formData, billingData, cart });
    // Başarılı ödeme sonrası yönlendirme
    router.push("/checkout/success");
  };

  if (!cart || cart.items.length === 0) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <p className="block mb-4">Sepetiniz boş.</p>
            <Button className="rounded-full" asChild>
              <Link href="/cart">Sepete Git</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <BreadcrumbCheckout />
        <h2
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
          ])}
        >
          Ödeme
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">
            {/* Sol Taraf - Form */}
            <div className="w-full lg:flex-1 space-y-6">
              {/* Teslimat Bilgileri */}
              <div className="p-5 md:p-6 rounded-[20px] border border-black/10">
                <h3 className="text-xl md:text-2xl font-bold text-black mb-5">
                  Teslimat Bilgileri
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Ad <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-[#F0F0F0] rounded-full">
                        <InputGroup.Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          placeholder="Adınız"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="bg-transparent placeholder:text-black/40"
                        />
                      </InputGroup>
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Soyad <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-[#F0F0F0] rounded-full">
                        <InputGroup.Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          placeholder="Soyadınız"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-transparent placeholder:text-black/40"
                        />
                      </InputGroup>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-[#F0F0F0] rounded-full">
                      <InputGroup.Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="ornek@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-transparent placeholder:text-black/40"
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-[#F0F0F0] rounded-full">
                      <InputGroup.Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="05XX XXX XX XX"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-transparent placeholder:text-black/40"
                      />
                    </InputGroup>
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <InputGroup className="bg-[#F0F0F0] rounded-full">
                      <InputGroup.Input
                        id="address"
                        name="address"
                        type="text"
                        required
                        placeholder="Mahalle, Sokak, Bina No"
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-transparent placeholder:text-black/40"
                      />
                    </InputGroup>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Şehir <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-[#F0F0F0] rounded-full">
                        <InputGroup.Input
                          id="city"
                          name="city"
                          type="text"
                          required
                          placeholder="İstanbul"
                          value={formData.city}
                          onChange={handleChange}
                          className="bg-transparent placeholder:text-black/40"
                        />
                      </InputGroup>
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Posta Kodu <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-[#F0F0F0] rounded-full">
                        <InputGroup.Input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          required
                          placeholder="34000"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="bg-transparent placeholder:text-black/40"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fatura Adresi */}
              <div className="p-5 md:p-6 rounded-[20px] border border-black/10">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl md:text-2xl font-bold text-black">
                    Fatura Adresi
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-black/60">
                      Teslimat adresi ile aynı
                    </span>
                  </label>
                </div>
                {!sameAsShipping && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="billingFirstName"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Ad <span className="text-red-500">*</span>
                        </label>
                        <InputGroup className="bg-[#F0F0F0] rounded-full">
                          <InputGroup.Input
                            id="billingFirstName"
                            name="firstName"
                            type="text"
                            required={!sameAsShipping}
                            placeholder="Adınız"
                            value={billingData.firstName}
                            onChange={handleBillingChange}
                            className="bg-transparent placeholder:text-black/40"
                          />
                        </InputGroup>
                      </div>
                      <div>
                        <label
                          htmlFor="billingLastName"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Soyad <span className="text-red-500">*</span>
                        </label>
                        <InputGroup className="bg-[#F0F0F0] rounded-full">
                          <InputGroup.Input
                            id="billingLastName"
                            name="lastName"
                            type="text"
                            required={!sameAsShipping}
                            placeholder="Soyadınız"
                            value={billingData.lastName}
                            onChange={handleBillingChange}
                            className="bg-transparent placeholder:text-black/40"
                          />
                        </InputGroup>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="billingAddress"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Adres <span className="text-red-500">*</span>
                      </label>
                      <InputGroup className="bg-[#F0F0F0] rounded-full">
                        <InputGroup.Input
                          id="billingAddress"
                          name="address"
                          type="text"
                          required={!sameAsShipping}
                          placeholder="Mahalle, Sokak, Bina No"
                          value={billingData.address}
                          onChange={handleBillingChange}
                          className="bg-transparent placeholder:text-black/40"
                        />
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="billingCity"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Şehir <span className="text-red-500">*</span>
                        </label>
                        <InputGroup className="bg-[#F0F0F0] rounded-full">
                          <InputGroup.Input
                            id="billingCity"
                            name="city"
                            type="text"
                            required={!sameAsShipping}
                            placeholder="İstanbul"
                            value={billingData.city}
                            onChange={handleBillingChange}
                            className="bg-transparent placeholder:text-black/40"
                          />
                        </InputGroup>
                      </div>
                      <div>
                        <label
                          htmlFor="billingPostalCode"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Posta Kodu <span className="text-red-500">*</span>
                        </label>
                        <InputGroup className="bg-[#F0F0F0] rounded-full">
                          <InputGroup.Input
                            id="billingPostalCode"
                            name="postalCode"
                            type="text"
                            required={!sameAsShipping}
                            placeholder="34000"
                            value={billingData.postalCode}
                            onChange={handleBillingChange}
                            className="bg-transparent placeholder:text-black/40"
                          />
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ödeme Yöntemi */}
              <div className="p-5 md:p-6 rounded-[20px] border border-black/10">
                <h3 className="text-xl md:text-2xl font-bold text-black mb-5">
                  Ödeme Yöntemi
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-black/20 rounded-lg cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === "credit-card"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <FaCreditCard className="text-xl text-black/60" />
                    <span className="flex-1 font-medium">Kredi Kartı</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-black/20 rounded-lg cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={formData.paymentMethod === "cash-on-delivery"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <FaMoneyBillWave className="text-xl text-black/60" />
                    <span className="flex-1 font-medium">Kapıda Ödeme</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Sipariş Özeti */}
            <div className="w-full lg:max-w-[505px] p-5 md:p-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
              <h6 className="text-xl md:text-2xl font-bold text-black">
                Sipariş Özeti
              </h6>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={`${item.id}-${item.attributes.join("-")}`}
                    className="flex gap-3 pb-4 border-b border-black/10 last:border-0"
                  >
                    <div className="bg-[#F0EEED] rounded-lg w-20 h-20 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.srcUrl}
                        width={80}
                        height={80}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black text-sm md:text-base truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-black/60">
                        {item.attributes.join(", ")}
                      </p>
                      <p className="text-sm font-bold text-black mt-1">
                        {item.discount.percentage > 0
                          ? `₺${Math.round(
                              item.price -
                                (item.price * item.discount.percentage) / 100
                            )}`
                          : item.discount.amount > 0
                          ? `₺${item.price - item.discount.amount}`
                          : `₺${item.price}`}
                        <span className="text-black/60 font-normal ml-1">
                          x {item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-5 pt-4 border-t border-black/10">
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black/60">Ara Toplam</span>
                  <span className="md:text-xl font-bold">₺{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black/60">
                    İndirim (-
                    {Math.round(
                      ((totalPrice - adjustedTotalPrice) / totalPrice) * 100
                    )}
                    %)
                  </span>
                  <span className="md:text-xl font-bold text-red-600">
                    -₺{Math.round(totalPrice - adjustedTotalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black/60">
                    Teslimat Ücreti
                  </span>
                  <span className="md:text-xl font-bold">Ücretsiz</span>
                </div>
                <hr className="border-t-black/10" />
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black font-bold">Toplam</span>
                  <span className="text-xl md:text-2xl font-bold">
                    ₺{Math.round(adjustedTotalPrice)}
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                className="text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group flex items-center justify-center gap-2"
              >
                <FaLock className="text-lg" />
                Siparişi Tamamla
              </Button>
              <p className="text-xs text-black/60 text-center">
                Güvenli ödeme ile korunuyorsunuz
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
