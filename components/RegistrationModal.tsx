
import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, CheckCircle, Lock, Crown, CreditCard, ShieldCheck, QrCode, ArrowRight, Copy, ExternalLink, Upload, FileCheck, Loader2, CalendarCheck, RefreshCw } from 'lucide-react';
import { useLead } from './LeadContext';

const RegistrationModal: React.FC = () => {
  const { isModalOpen, closeModal, registerLead, renewSubscription, modalTitle, modalSubtitle, subscriptionExpired, siteConfig } = useLead();
  
  // Step 1: Registration, Step 2: Payment
  const [step, setStep] = useState<1 | 2>(1);
  
  // Registration Data
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    cpf: ''
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Receipt Validation State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'analyzing' | 'valid' | 'invalid'>('idle');

  // Logic to handle RENEWAL flow
  useEffect(() => {
    if (isModalOpen) {
      if (subscriptionExpired) {
        // If expired, skip data entry and go straight to payment
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [isModalOpen, subscriptionExpired]);

  if (!isModalOpen) return null;

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Mask CPF: 000.000.000-00
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    setFormData({...formData, cpf: value});
  };

  const proceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.cpf) return;
    if (formData.cpf.length < 14) {
        alert("Por favor, digite um CPF válido.");
        return;
    }
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setReceiptFile(file);
          setValidationStatus('idle'); // Reset status if new file
      }
  };

  const analyzeReceipt = () => {
      if (!receiptFile) return;

      setValidationStatus('analyzing');

      // Simulating AI Analysis of the Date
      setTimeout(() => {
          setValidationStatus('valid');
      }, 3000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;
    
    // Validate Receipt ONLY if configured to require it
    if (siteConfig.requireReceiptUpload && validationStatus !== 'valid') {
        alert("Por favor, valide o comprovante antes de continuar.");
        return;
    }

    setLoading(true);
    
    // Simulate API delay and Payment Processing
    setTimeout(() => {
      if (subscriptionExpired) {
        // RENEWAL
        renewSubscription();
      } else {
        // NEW REGISTRATION
        registerLead(formData);
      }
      
      setLoading(false);
      setAcceptedTerms(false); 
      setStep(1); 
      setReceiptFile(null);
      setValidationStatus('idle');
    }, 2000);
  };

  const handleClose = () => {
      closeModal();
      setTimeout(() => {
          setStep(1);
          setReceiptFile(null);
          setValidationStatus('idle');
      }, 300);
  };

  const isVipMessage = modalTitle.toLowerCase().includes('vip') || modalTitle.toLowerCase().includes('assinatura');

  const pixCode = "sinalizafoods@jim.com";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    alert("Chave PIX copiada!");
  };

  const todayDate = new Date().toLocaleDateString('pt-BR');

  const UploadUI = () => (
      <div className="bg-neutral-900/50 border border-dashed border-neutral-600 rounded-xl p-4 transition-colors hover:border-red-500/50">
          {validationStatus === 'valid' ? (
              <div className="flex flex-col items-center py-2 text-green-500">
                  <CalendarCheck size={32} className="mb-2" />
                  <p className="font-bold">Comprovante Validado!</p>
                  <p className="text-xs text-gray-400">Data: {todayDate}</p>
                  <button 
                    type="button"
                    onClick={() => { setReceiptFile(null); setValidationStatus('idle'); }}
                    className="text-xs underline mt-2 text-gray-500 hover:text-white"
                  >
                      Enviar outro
                  </button>
              </div>
          ) : (
              <>
                <input 
                    type="file" 
                    accept="image/*"
                    id="receipt-upload"
                    className="hidden"
                    onChange={handleFileChange}
                />
                
                {!receiptFile ? (
                    <label htmlFor="receipt-upload" className="flex flex-col items-center cursor-pointer py-2">
                        <Upload size={24} className="text-red-500 mb-2" />
                        <p className="text-gray-300 text-sm font-bold">Enviar Comprovante</p>
                        <p className="text-[10px] text-gray-500">Clique para selecionar o print (Imagem)</p>
                    </label>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-gray-300 mb-3">
                            <FileCheck size={16} className="text-blue-500" />
                            <span className="text-xs truncate max-w-[150px]">{receiptFile.name}</span>
                        </div>
                        
                        {validationStatus === 'analyzing' ? (
                            <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-3 py-1.5 rounded-full">
                                <Loader2 size={12} className="animate-spin" /> Verificando data...
                            </div>
                        ) : (
                            <button 
                                type="button"
                                onClick={analyzeReceipt}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg"
                            >
                                Validar Data do Comprovante
                            </button>
                        )}
                    </div>
                )}
              </>
          )}
      </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-red-900/30 shadow-2xl overflow-hidden transform transition-all animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-red-800 to-red-600 shrink-0">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3 backdrop-blur-md">
                {isVipMessage ? <Crown className="text-white w-6 h-6" /> : <Lock className="text-white w-6 h-6" />}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">
                {subscriptionExpired ? "Renovar Assinatura" : (step === 1 ? modalTitle : "Finalizar Pagamento")}
            </h2>
            
            <p className="text-red-100 text-xs leading-relaxed px-4">
                {subscriptionExpired 
                    ? "Seu acesso de 30 dias expirou. Renove para continuar." 
                    : (step === 1 ? modalSubtitle : "Escolha a forma de pagamento segura.")
                }
            </p>
            
            {/* Price Highlight */}
            <div className="mt-3 bg-black/30 rounded-lg py-2 px-4 inline-block backdrop-blur-sm border border-white/10">
                <p className="text-white text-sm font-bold">Assinatura Mensal: <span className="text-green-300 text-base">R$ 21,99</span></p>
            </div>
        </div>

        {/* Form & Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {step === 1 && !subscriptionExpired && (
              <form onSubmit={proceedToPayment} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Como podemos te chamar?"
                      className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">CPF (Sua chave de acesso)</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                      value={formData.cpf}
                      onChange={handleCpfChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg shadow-lg transform transition-all hover:-translate-y-1 mt-4 flex items-center justify-center gap-2"
                >
                    Ir para Pagamento <ArrowRight size={18} />
                </button>
                
                <p className="text-[10px] text-gray-600 text-center mt-3">
                  Seus dados estão seguros. Próxima etapa: Pagamento.
                </p>
              </form>
          )}

          {step === 2 && (
              <div className="animate-fade-in">
                  {/* Payment Method Tabs */}
                  <div className="flex bg-neutral-900 p-1 rounded-lg mb-6">
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('pix'); setValidationStatus('idle'); setReceiptFile(null); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'pix' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                          <QrCode size={14} /> PIX (Instantâneo)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('credit_card'); setValidationStatus('idle'); setReceiptFile(null); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'credit_card' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                          <CreditCard size={14} /> Cartão de Crédito
                      </button>
                  </div>

                  {paymentMethod === 'pix' && (
                      <div className="text-center space-y-4 mb-6">
                          <div className="bg-white p-4 rounded-xl inline-block">
                             {/* Simulated QR Code */}
                             <div className="w-32 h-32 bg-gray-900 flex items-center justify-center relative">
                                 <QrCode size={64} className="text-white" />
                                 <div className="absolute inset-0 border-4 border-black"></div>
                             </div>
                          </div>
                          <div>
                              <p className="text-white font-bold mb-2">Chave PIX (Copia e Cola)</p>
                              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 flex items-center justify-between gap-2">
                                  <code className="text-[12px] text-gray-400 break-all flex-1 text-left font-mono">
                                      {pixCode}
                                  </code>
                                  <button 
                                    onClick={handleCopyPix}
                                    className="text-green-500 hover:text-green-400 bg-neutral-800 p-2 rounded" 
                                    title="Copiar Chave"
                                  >
                                      <Copy size={20} />
                                  </button>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-2 mb-4">
                                  Faça o PIX e envie o comprovante abaixo para liberação imediata.
                              </p>

                              {/* RECEIPT UPLOAD SECTION - PIX */}
                              {siteConfig.requireReceiptUpload && <UploadUI />}
                          </div>
                      </div>
                  )}

                  {paymentMethod === 'credit_card' && (
                      <div className="space-y-6 mb-6 text-center">
                          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                                <p className="text-gray-300 text-sm mb-4">
                                    Para sua segurança, o pagamento é processado pela <strong>InfinitePay</strong>, uma plataforma certificada e segura.
                                </p>
                                
                                <a 
                                    href="https://link.infinitepay.io/sinalizafoods/Ri0x-18cKdKIEn3-21,99"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-1"
                                >
                                    <ExternalLink size={18} />
                                    Pagar R$ 21,99 no Cartão
                                </a>

                                <p className="text-[10px] text-gray-500 mt-3 mb-4">
                                    Uma nova aba será aberta. Após concluir o pagamento, retorne aqui e <strong>confirme abaixo</strong>.
                                </p>

                                {/* RECEIPT UPLOAD SECTION - CREDIT CARD */}
                                {siteConfig.requireReceiptUpload && <UploadUI />}
                          </div>
                      </div>
                  )}

                  {/* Disclaimer & Terms */}
                  <div className="mt-4">
                        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 h-20 overflow-y-auto mb-2 custom-scrollbar">
                            <p className="text-[10px] text-gray-400 leading-relaxed text-justify">
                                <strong>AVISO LEGAL:</strong> O site é apenas um guia. Não nos responsabilizamos por acidentes ou serviços de terceiros. Ao prosseguir, você concorda que o acesso às informações é de sua responsabilidade. Descontos são geridos pelas empresas parceiras.
                            </p>
                        </div>
                        <label className="flex items-start gap-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    required
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600 bg-neutral-800 checked:bg-green-500 checked:border-green-500 transition-all"
                                />
                                <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3 h-3 top-0.5 left-0.5" />
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-gray-300 select-none leading-tight">
                                Li e concordo com os termos de uso.
                            </span>
                        </label>
                    </div>

                    <div className="flex gap-3 mt-4">
                        {!subscriptionExpired && (
                            <button 
                                onClick={() => setStep(1)}
                                type="button"
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold py-3 rounded-lg transition-colors text-sm"
                            >
                                Voltar
                            </button>
                        )}
                        <button
                            onClick={handlePaymentSubmit}
                            disabled={loading || !acceptedTerms || (siteConfig.requireReceiptUpload && validationStatus !== 'valid')}
                            className={`flex-[2] ${!acceptedTerms || (siteConfig.requireReceiptUpload && validationStatus !== 'valid') ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700 text-white'} font-bold py-3 rounded-lg shadow-lg transform transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-sm`}
                        >
                            {loading ? (
                                <span>Processando...</span>
                            ) : (
                                <>
                                {subscriptionExpired ? <RefreshCw size={18} /> : <CheckCircle size={18} />}
                                {subscriptionExpired ? 'Renovar Assinatura' : (paymentMethod === 'pix' ? 'Confirmar Acesso' : 'Finalizar Assinatura')}
                                </>
                            )}
                        </button>
                    </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;