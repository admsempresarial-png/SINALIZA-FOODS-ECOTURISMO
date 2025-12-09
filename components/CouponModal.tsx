import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Clock, Ticket, AlertTriangle, CheckCircle, AlertOctagon, Timer } from 'lucide-react';
import { useLead } from './LeadContext';

const CouponModal: React.FC = () => {
  const { 
      isCouponModalOpen, 
      closeCouponModal, 
      selectedCompanyForCoupon, 
      currentUserCpf, 
      trackCouponUsage, 
      getLastUsageTimestamp,
      getTodayUsageCount
  } = useLead();

  const [inputCpf, setInputCpf] = useState('');
  const [step, setStep] = useState<'validation' | 'success' | 'blocked'>('validation');
  const [timeRemainingBlocked, setTimeRemainingBlocked] = useState<string>(''); // For the 1h block
  
  // Validity Timer State
  const [validityTimeLeft, setValidityTimeLeft] = useState<number>(0);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  useEffect(() => {
    if (isCouponModalOpen) {
        setStep('validation');
        setInputCpf('');
        setTimeRemainingBlocked('');
        setIsCodeExpired(false);
    }
  }, [isCouponModalOpen]);

  // Timer Effect for Active Code
  useEffect(() => {
      // Use 'any' or 'ReturnType<typeof setInterval>' to avoid NodeJS namespace dependency
      let interval: any;
      
      if (step === 'success' && selectedCompanyForCoupon && !isCodeExpired) {
          const lastUsage = getLastUsageTimestamp(selectedCompanyForCoupon.id);
          
          if (lastUsage) {
              const VALIDITY_PERIOD_MS = 10 * 60 * 1000; // 10 Minutes
              const expiresAt = lastUsage + VALIDITY_PERIOD_MS;

              // Update immediately
              const updateTimer = () => {
                  const now = Date.now();
                  const diffSeconds = Math.ceil((expiresAt - now) / 1000);
                  
                  if (diffSeconds <= 0) {
                      setValidityTimeLeft(0);
                      setIsCodeExpired(true);
                      clearInterval(interval);
                  } else {
                      setValidityTimeLeft(diffSeconds);
                  }
              };

              updateTimer(); // Run once immediately
              interval = setInterval(updateTimer, 1000);
          }
      }

      return () => clearInterval(interval);
  }, [step, selectedCompanyForCoupon, getLastUsageTimestamp, isCodeExpired]);

  if (!isCouponModalOpen || !selectedCompanyForCoupon) return null;

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Mask CPF: 000.000.000-00
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    setInputCpf(value);
  };

  const handleValidate = (e: React.FormEvent) => {
      e.preventDefault();

      // 1. Validate Identity
      if (inputCpf !== currentUserCpf) {
          alert("CPF inválido! Digite o mesmo CPF utilizado no cadastro.");
          return;
      }

      // 2. Check Cooldown (1 Hour = 3600000 ms)
      const lastUsage = getLastUsageTimestamp(selectedCompanyForCoupon.id);
      const now = Date.now();
      const ONE_HOUR = 3600000;

      if (lastUsage && (now - lastUsage) < ONE_HOUR) {
          // Block Usage
          const diff = ONE_HOUR - (now - lastUsage);
          const minutes = Math.ceil(diff / 60000);
          setTimeRemainingBlocked(`${minutes} minutos`);
          setStep('blocked');
      } else {
          // Allow Usage
          trackCouponUsage(selectedCompanyForCoupon.id);
          setIsCodeExpired(false);
          setStep('success');
      }
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (validityTimeLeft / 600) * 100; // 600 seconds = 10 mins

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={closeCouponModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-purple-500/50 shadow-2xl overflow-hidden flex flex-col transform transition-all animate-fade-in-up">
        
        {/* Header */}
        <div className={`p-6 text-center relative transition-colors duration-500 ${isCodeExpired && step === 'success' ? 'bg-neutral-800' : 'bg-gradient-to-r from-purple-800 to-indigo-900'}`}>
            <button 
                onClick={closeCouponModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 backdrop-blur-md border ${isCodeExpired && step === 'success' ? 'bg-neutral-700 border-neutral-600' : 'bg-white/10 border-white/20'}`}>
                {isCodeExpired && step === 'success' ? <AlertOctagon className="text-gray-500 w-8 h-8" /> : <Ticket className="text-white w-8 h-8" />}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{selectedCompanyForCoupon.name}</h2>
            <p className={`text-xs uppercase tracking-widest font-bold ${isCodeExpired && step === 'success' ? 'text-gray-500' : 'text-purple-200'}`}>
                {isCodeExpired ? 'Cupom Expirado' : 'Área do Cupom VIP'}
            </p>
        </div>

        {/* Body */}
        <div className="p-8">
            
            {/* Step 1: Validation */}
            {step === 'validation' && (
                <form onSubmit={handleValidate} className="space-y-6">
                    {/* Warning Box */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 w-6 h-6 shrink-0 mt-0.5" />
                        <div className="text-left">
                            <h4 className="text-yellow-500 font-bold text-sm mb-1">ATENÇÃO: LEIA ANTES!</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                Este código tem validade de apenas <strong>10 minutos</strong> após ser gerado. 
                                <br/><br/>
                                <span className="text-white font-bold underline">Só clique em confirmar se você já estiver dentro do estabelecimento</span> e pronto para apresentar ao atendente.
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-300 text-sm mb-4">
                            Confirme seu CPF para liberar o código:
                        </p>
                    </div>

                    <div>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 w-5 h-5" />
                            <input
                                type="text"
                                required
                                placeholder="000.000.000-00"
                                maxLength={14}
                                className="w-full bg-neutral-900 border border-neutral-700 text-white text-lg rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono tracking-wide"
                                value={inputCpf}
                                onChange={handleCpfChange}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={closeCouponModal}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold py-3.5 rounded-xl transition-colors"
                        >
                            Deixar p/ Depois
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:-translate-y-1"
                        >
                            Estou no Local
                        </button>
                    </div>
                </form>
            )}

            {/* Step 2: Blocked (Cooldown) */}
            {step === 'blocked' && (
                <div className="text-center space-y-6">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                        <div className="inline-flex bg-yellow-500/20 p-3 rounded-full mb-4">
                            <Clock className="text-yellow-500 w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aguarde um pouco!</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Você utilizou este desconto recentemente. Para utilizar novamente, é necessário aguardar o tempo limite.
                        </p>
                        <div className="bg-neutral-900 rounded-lg py-3 px-6 inline-block">
                            <span className="text-yellow-500 font-mono text-xl font-bold">
                                {timeRemainingBlocked}
                            </span>
                            <span className="text-gray-500 text-xs block mt-1">Tempo Restante</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={closeCouponModal}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3.5 rounded-xl transition-colors"
                    >
                        Voltar e Aguardar
                    </button>
                </div>
            )}

            {/* Step 3: Success (Show Code with Timer) */}
            {step === 'success' && (
                <div className="text-center space-y-6">
                    
                    {!isCodeExpired ? (
                        <>
                            {/* Active Code UI */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 bg-green-500/20 rounded-bl-xl">
                                    <CheckCircle className="text-green-500 w-5 h-5" />
                                </div>
                                
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Código Liberado</p>
                                <h3 className="text-3xl font-black text-white mb-4 tracking-widest border-2 border-dashed border-white/20 py-2 rounded-lg bg-black/20">
                                    {selectedCompanyForCoupon.couponCode}
                                </h3>
                                
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-4 mt-2">
                                    <div className="text-left">
                                        <span className="block text-gray-500">Titular (CPF)</span>
                                        <span className="text-white font-mono">{currentUserCpf}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-gray-500">Utilização Hoje</span>
                                        <span className="text-green-400 font-bold text-lg">#{getTodayUsageCount(selectedCompanyForCoupon.id)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timer Progress */}
                            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                        <Timer size={14} className="text-red-500" /> Expira em:
                                    </span>
                                    <span className={`font-mono font-bold text-lg ${validityTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                        {formatTime(validityTimeLeft)}
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-linear ${validityTimeLeft < 60 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-neutral-900 p-4 rounded-xl flex items-start gap-3 text-left">
                                <AlertTriangle className="text-yellow-500 w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Apresente esta tela ao atendente AGORA. Tire um print se necessário! O código expira em 10 minutos.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Expired UI */}
                            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 relative overflow-hidden opacity-75">
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-[2px]">
                                    <div className="bg-neutral-900 px-4 py-2 rounded-lg border border-red-900/50 shadow-2xl transform -rotate-12">
                                        <span className="text-red-500 font-black text-2xl uppercase tracking-widest border-2 border-red-500 px-2 py-1 rounded">
                                            EXPIRADO
                                        </span>
                                    </div>
                                </div>
                                
                                <h3 className="text-3xl font-black text-gray-600 mb-4 tracking-widest blur-sm select-none">
                                    {selectedCompanyForCoupon.couponCode}
                                </h3>
                                <div className="blur-sm select-none">
                                    <p className="text-gray-600 text-xs">Código inválido</p>
                                </div>
                            </div>

                            <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl text-center">
                                <p className="text-red-400 text-sm font-bold">
                                    O tempo limite para uso deste cupom acabou.
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Você poderá gerar um novo código em 1 hora.
                                </p>
                            </div>
                        </>
                    )}

                    <button
                        onClick={closeCouponModal}
                        className={`w-full ${isCodeExpired ? 'bg-neutral-700 hover:bg-neutral-600 text-gray-300' : 'bg-green-600 hover:bg-green-700 text-white'} font-bold py-3.5 rounded-xl shadow-lg transition-colors`}
                    >
                        Fechar
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default CouponModal;