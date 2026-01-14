import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  User,
  Bot,
  Sparkles,
  Calendar,
  FileText,
  Hospital,
  Syringe,
  Shield,
  ChevronRight,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Settings,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  message: string;
}

type PersonalizationStep = 'welcome' | 'name' | 'concern' | 'location' | 'complete';

const ChatbotWidget: React.FC = () => {
  const { user, isAuthenticated, patients, hospitals } = useAuth();
  // Simple notification sound (base64)
  const notificationSound = "data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//tQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAZAAABmwAMDAwMDBQUFBQUJCQkJCQtLS0tLTExMTExOjo6OjpCQkJCQkxMTExMVFRUVFRdXV1dXWRkZGRkbGxsbGx0dHR0dHp6enp6g4ODg4OMjIyMjJSUlJSUnZ2dnZ2mpqampq6urq6utra2trbCwsLCwsrKysrK1NTU1NTd3d3d3ePj4+Pj7e3t7e329vb29v///wAAAAAYTGF2YzU5LjM3LjEwMAAAAAAAAAAAAP/7UGQAAAaEwYV1QAAl6AwsLgAAEAAH8AAH8AAAAA2B4kQAAAAJ/wAAAAABCtM1u3/8Gf8AAAAAAW48hQAAAAF/wAAAAABD5y5f/wZ/wAAAAAA//tQZAAABoTBhXVAACXoDCwuAAAQAAfwAAfwAAAADYHiRAAAAAn/AAAAAAEK0zW7f/wZ/wAAAAABbjyFAAAAAX/AAAAAAEPnLl//Bn/AAAAAAUA//tQZAAABoTBhXVAACXoDCwuAAAQAAfwAAfwAAAADYHiRAAAAAn/AAAAAAEK0zW7f/wZ/wAAAAABbjyFAAAAAX/AAAAAAEPnLl//Bn/AAAAAAUA";

  const playNotificationSound = () => {
    try {
      const audio = new Audio(notificationSound);
      audio.volume = 0.5;
      // Handle browser autoplay policies
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented
          console.log("Audio playback prevented:", error);
        });
      }
    } catch (e) {
      console.error("Audio playback configuration failed", e);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [personalizationStep, setPersonalizationStep] = useState<PersonalizationStep>('welcome');
  const [userData, setUserData] = useState({ name: '', concern: '', location: '' });
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, [isOpen]);



  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const quickActions: QuickAction[] = [
    { icon: <Calendar className="h-4 w-4" />, label: 'Book Appointment', message: 'I want to book an appointment' },
    { icon: <Syringe className="h-4 w-4" />, label: 'Vaccination Info', message: 'Tell me about COVID vaccination' },
    { icon: <FileText className="h-4 w-4" />, label: 'My Reports', message: 'How can I view my test reports?' },
    { icon: <Hospital className="h-4 w-4" />, label: 'Find Hospital', message: 'Help me find a nearby hospital' },
  ];
  const botResponses: Record<string, string> = {
    'appointment': '📅 I can help you book an appointment! Please go to "Search Hospital" from your dashboard, select a hospital, and choose your preferred date and time.',
    'vaccination': '💉 COVID-19 vaccination is crucial for protection! We offer all major vaccines including Covishield, Covaxin, Pfizer, and Moderna.',
    'reports': '📋 You can view all your test reports and vaccination history in the "My Reports" section.',
    'hospital': '🏥 To find a hospital near you, use our "Search Hospital" feature! Filter by city and see all approved facilities.',
    'covid': '🦠 COVID-19 is caused by the SARS-CoV-2 virus. Our platform helps you book tests and vaccinations at certified hospitals.',
    'symptoms': '🤒 Common COVID-19 symptoms include: fever, dry cough, tiredness, loss of taste/smell. If severe, book an immediate appointment.',
    'test': '🧪 We offer COVID-19 testing at all approved hospitals! Results within 24-48 hours.',
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage = isAuthenticated && user
      ? `Welcome back, ${user.name}! 👋 How can I help you today?`
      : `Hello! 👋 I'm CoronaBot, your COVID-19 healthcare assistant. Let's get started!`;

    addBotMessage(welcomeMessage);
    setPersonalizationStep(isAuthenticated ? 'complete' : 'name');
  };

  const addBotMessage = (content: string) => {
    if (soundEnabled) {
      playNotificationSound();
    }
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'bot',
      content,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
    setShowQuickActions(false);
  };

  const handlePersonalizationResponse = (input: string) => {
    switch (personalizationStep) {
      case 'name':
        setUserData(prev => ({ ...prev, name: input }));
        addBotMessage(`Nice to meet you, ${input}! 😊 What's your main health concern?`);
        setPersonalizationStep('concern');
        break;
      case 'concern':
        setUserData(prev => ({ ...prev, concern: input }));
        addBotMessage(`Got it! Which city are you in? 📍`);
        setPersonalizationStep('location');
        break;
      case 'location':
        setUserData(prev => ({ ...prev, location: input }));
        addBotMessage(`Perfect, ${userData.name}! 🎉 How can I help you today?`);
        setPersonalizationStep('complete');
        setShowQuickActions(true);
        break;
    }
  };

  const getBotResponse = async (input: string) => {
    // Check local responses first
    const lowerInput = input.toLowerCase();
    let localResponse = null;

    if (lowerInput.includes('appointment') || lowerInput.includes('book')) localResponse = botResponses.appointment;
    else if (lowerInput.includes('vaccin') || lowerInput.includes('dose')) localResponse = botResponses.vaccination;
    else if (lowerInput.includes('report') || lowerInput.includes('result')) localResponse = botResponses.reports;
    else if (lowerInput.includes('hospital') || lowerInput.includes('find')) localResponse = botResponses.hospital;
    else if (lowerInput.includes('covid') || lowerInput.includes('corona')) localResponse = botResponses.covid;
    else if (lowerInput.includes('symptom') || lowerInput.includes('fever')) localResponse = botResponses.symptoms;
    else if (lowerInput.includes('test')) localResponse = botResponses.test;
    // Basic greetings
    else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) localResponse = "Hello! 👋 How can I assist you with your COVID-19 related queries today?";
    else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) localResponse = "Stay safe! 👋 Remember to mask up and sanitize.";

    if (localResponse) {
      addBotMessage(localResponse);
      return;
    }

    // Require Login for AI/API responses
    if (!isAuthenticated) {
      addBotMessage("To provide you with personalized assistance and access my full knowledge base, please log in or create an account. 🔒\n\nOnce logged in, I can help you find specific hospitals, manage your appointments, and answer complex queries!");
      return;
    }

    // Get User Context (Location/City)
    let userContext = '';
    if (user?.role === 'patient') {
      const patient = patients.find(p => p.id === user.id);
      if (patient?.city) userContext += ` User Location: ${patient.city}.`;
    } else if (user?.role === 'hospital') {
      const hospital = hospitals.find(h => h.id === user.id);
      if (hospital?.city) userContext += ` Hospital Location: ${hospital.city}.`;
    }

    // Call API with Context
    setIsTyping(true);
    try {
      const response = await api.post('/ai/chat', {
        message: input,
        role: user?.role || 'user',
        user_name: user?.name,
        context: userContext // Send derived context to backend
      });

      if (response.data.success) {
        addBotMessage(response.data.data.reply);
      } else {
        addBotMessage("I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.");
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      addBotMessage("I'm sorry, something went wrong. Please check your connection.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message immediately
    const input = inputValue;
    addUserMessage(input);
    setInputValue('');

    // Handle personalization flow locally, otherwise hit API
    if (personalizationStep !== 'complete' && personalizationStep !== 'welcome') {
      handlePersonalizationResponse(input);
    } else {
      await getBotResponse(input);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    addUserMessage(action.message);
    await getBotResponse(action.message);
  };

  const handleReset = () => {
    setMessages([]);
    setPersonalizationStep('welcome');
    setUserData({ name: '', concern: '', location: '' });
    setShowQuickActions(true);
    setTimeout(() => initializeChat(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Hide chatbot on Admin and Hospital Dashboard pages
  if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/hospital')) {
    return null;
  }

  return (
    <>
      {/* Modern Floating Chat Button - Fully Responsive */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-500",
          "bottom-4 right-4 sm:bottom-6 sm:right-6",
          isOpen && "hidden"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ripple Effect */}
        <div className="absolute inset-0 -m-2">
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative rounded-2xl shadow-2xl transition-all duration-300",
            "p-3 sm:p-4",
            "bg-gradient-to-br from-primary via-primary to-secondary",
            "hover:shadow-primary/50 hover:shadow-2xl hover:scale-110",
            "group overflow-hidden"
          )}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <div className="relative flex items-center gap-2">
            <div className="relative">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              <Zap className={cn(
                "absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-warning transition-all duration-300",
                isHovered ? "scale-125 rotate-12" : "scale-100"
              )} />
            </div>

            {/* Expanded Text on Hover - Hidden on mobile */}
            <span className={cn(
              "text-primary-foreground font-medium whitespace-nowrap overflow-hidden transition-all duration-300 hidden sm:block",
              isHovered ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
            )}>
              Chat with us
            </span>
          </div>

          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
            1
          </span>
        </button>
      </div>

      {/* Chat Window - Fully Responsive */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-card border border-border shadow-2xl transition-all duration-300 overflow-hidden",
            "backdrop-blur-xl",
            isMinimized
              ? "bottom-4 right-4 sm:bottom-6 sm:right-6 w-64 sm:w-72 h-14 rounded-2xl"
              : cn(
                "rounded-2xl sm:rounded-3xl",
                // Mobile: Full screen with margins
                "inset-2 sm:inset-auto",
                // Tablet and up: Fixed size positioned bottom-right
                "sm:bottom-6 sm:right-6 sm:w-[360px] md:w-[380px] lg:w-[400px]",
                "sm:h-[500px] md:h-[550px] lg:h-[580px] sm:max-h-[85vh]"
              )
          )}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary via-primary to-secondary p-3 sm:p-4 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full blur-2xl" />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 bg-green-400 rounded-full border-2 border-primary shadow-lg">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-primary-foreground flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    CoronaBot
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                  </h3>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/80">AI Healthcare Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors">
                      <Settings className="h-4 w-4 text-primary-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 sm:w-48">
                    <DropdownMenuLabel className="text-xs sm:text-sm">Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSoundEnabled(!soundEnabled)} className="text-xs sm:text-sm">
                      {soundEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                      {soundEnabled ? 'Mute' : 'Unmute'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleTheme} className="text-xs sm:text-sm">
                      {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleReset} className="text-destructive text-xs sm:text-sm">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4 text-primary-foreground" /> : <Minimize2 className="h-4 w-4 text-primary-foreground" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  <X className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-56px)] sm:h-[calc(100%-68px)]">
              {/* Status Bar */}
              <div className="px-3 sm:px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {isAuthenticated && user ? (
                    <Badge className="bg-secondary/20 text-secondary border-0 text-[10px] sm:text-xs">
                      <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      {user.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      Guest
                    </Badge>
                  )}
                </div>
                {userData.name && !isAuthenticated && (
                  <span className="text-[10px] sm:text-xs text-primary">{userData.name}</span>
                )}
              </div>

              {/* Messages - Flexible height */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-background to-muted/10">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 sm:gap-3 animate-fade-in",
                      message.type === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-md",
                      message.type === 'user'
                        ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                        : "bg-gradient-to-br from-muted to-muted/50 text-primary"
                    )}>
                      {message.type === 'user' ? <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] sm:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm",
                      message.type === 'user'
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm sm:rounded-br-md"
                        : "bg-card border border-border rounded-bl-sm sm:rounded-bl-md text-foreground"
                    )}>
                      <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                      <span className={cn(
                        "text-[9px] sm:text-[10px] mt-1 block opacity-60",
                        message.type === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 sm:gap-3 animate-fade-in">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-md">
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl rounded-bl-sm sm:rounded-bl-md px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex gap-1 sm:gap-1.5">
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {showQuickActions && personalizationStep === 'complete' && (
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-border bg-muted/30 shrink-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 font-medium">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 text-[10px] sm:text-xs bg-card hover:bg-primary/5 border border-border hover:border-primary/30 rounded-lg sm:rounded-xl transition-all group"
                      >
                        <span className="text-primary">{action.icon}</span>
                        <span className="flex-1 text-left font-medium truncate">{action.label}</span>
                        <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      personalizationStep === 'name' ? "Your name..."
                        : personalizationStep === 'concern' ? "Your concern..."
                          : personalizationStep === 'location' ? "Your city..."
                            : "Type a message..."
                    }
                    className="flex-1 rounded-lg sm:rounded-xl bg-muted/50 border-border text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg h-9 w-9 sm:h-10 sm:w-10"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground mt-2">
                  Powered by CoronaBot AI 🦠
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
