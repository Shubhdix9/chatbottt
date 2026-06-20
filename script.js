document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // ═══════════════════════════════════════
    //  ENHANCED KNOWLEDGE BASE
    // ═══════════════════════════════════════
    const faqDB = [
        {
            keywords: ["what is", "vicharanashala", "internship", "vins", "about"],
            answer: "The Vicharanashala internship (VINS) is a <strong>two-month, full-time</strong> engagement at the Vicharanashala Lab, a research lab at <strong>IIT Ropar</strong>. You will work on a real open-source project under a mentor, after a short training phase. It is completely free and the work is real.",
            followUp: ["How long is it?", "Do I need a laptop?", "Is there a stipend?"]
        },
        {
            keywords: ["who", "internship for", "alumni", "eligible", "eligibility"],
            answer: "The internship is generally for <strong>students</strong>. If you're an alumni, please reach out via <strong>Samagama.in</strong> to confirm your specific eligibility.",
            followUp: ["What is Samagama?", "How do I apply?"]
        },
        {
            keywords: ["iit ropar", "official", "summer research"],
            answer: "VINS is conducted at the Vicharanashala Lab at <strong>IIT Ropar</strong>, but it has its own selection process and structure. It may differ from the general IIT Ropar Summer Research Internship.",
            followUp: ["What is VINS?", "How to get selected?"]
        },
        {
            keywords: ["leave", "exam", "june", "july", "august", "class", "tomorrow", "today", "absent"],
            answer: "If you have exams, you can request a <strong>relaxation</strong> during your exam window. However, please coordinate with your team and update your status via the dashboard.",
            followUp: ["What about Spurti Points?", "How does attendance work?"]
        },
        {
            keywords: ["when", "start", "how long", "duration", "dates"],
            answer: "The internship runs for <strong>two months</strong>. You begin on your allocated start date. If you have exams, you can request a relaxation window.",
            followUp: ["Can I take leave?", "What is VINS?"]
        },
        {
            keywords: ["noc", "no objection certificate", "sign", "format", "submit", "deadline"],
            answer: "Your NOC should follow a standard format — your college's own format is usually fine. It can be signed by your <strong>HOD</strong> or <strong>Program Chair</strong>. Check the dashboard or ask Yaksha on Samagama.in for alternatives.",
            followUp: ["I'm from IIT Ropar", "Where to submit?"]
        },
        {
            keywords: ["selection", "selected", "offer letter", "accept", "opt", "apply", "how to get"],
            answer: "You'll be notified of your selection via <strong>email and dashboard</strong>. You can opt-in and accept the offer letter through the portal. Your start date and details will be confirmed there.",
            followUp: ["What is VINS?", "Do I get a certificate?"]
        },
        {
            keywords: ["certificate", "grade report", "credit", "physical", "e-certificate"],
            answer: "Yes! You will receive a <strong>certificate</strong> upon successful completion. Whether it's an e-certificate or physical copy will be detailed in your offer letter or final completion packet.",
            followUp: ["Is there a stipend?", "What do I work on?"]
        },
        {
            keywords: ["minor", "major", "ai", "student", "ropar"],
            answer: "If you're a <strong>Minor/Major in AI</strong> student from IIT Ropar, you do <strong>not need an NOC</strong>. You can join the programme directly!",
            followUp: ["What is VINS?", "What do I work on?"]
        },
        {
            keywords: ["work on", "hours", "mentor", "stipend", "laptop", "project"],
            answer: "You'll work on a <strong>real open-source project</strong> under a mentor. It's full-time (typically 6-8 hours). There is <strong>no stipend</strong>, and you'll need your own laptop. If your mentor hasn't contacted you on Day 1, check the communication channels.",
            followUp: ["What are the channels?", "What is Rosetta?"]
        },
        {
            keywords: ["communication", "whatsapp", "group", "channel", "contact"],
            answer: "Official channels are the <strong>dashboard</strong> and designated platforms. WhatsApp groups may exist, but rely on <strong>official emails</strong> and the Samagama platform first.",
            followUp: ["What is Samagama?", "What is VINS?"]
        },
        {
            keywords: ["rosetta", "journal", "thinking routine", "chatgpt"],
            answer: "Rosetta is your internship journal for <strong>'thinking routines'</strong>. It's not busywork — it helps track your learning! Please write your own entries. <strong>Do not use ChatGPT</strong> to write them.",
            followUp: ["What is ViBe?", "What are Spurti Points?"]
        },
        {
            keywords: ["vibe", "lms", "live sessions", "zoom", "coursework", "attendance", "standup"],
            answer: "Phase 1 involves coursework on the <strong>ViBe LMS</strong>. Log in with your registered email. Live sessions and Zoom standups have <strong>strict participation rules</strong>. Make sure your Zoom ID is correct in the system.",
            followUp: ["What are Spurti Points?", "Can I take leave?"]
        },
        {
            keywords: ["spurti points", "sp", "penalty", "calculate", "terminated", "points"],
            answer: "<strong>Spurti Points (SP)</strong> track your participation on a rolling basis. While the system evolves, falling below required levels <strong>can impact your evaluation</strong>. Stay active and engaged!",
            followUp: ["How does attendance work?", "What is ViBe?"]
        },
        {
            keywords: ["yaksha", "chat", "type", "interact", "bot", "you"],
            answer: "I'm Yaksha, your AI assistant for the VINS internship! 🤖 If you're having trouble using the chat, try <strong>refreshing the page</strong>. I'm here to help you throughout your journey.",
            followUp: ["What is VINS?", "What are Spurti Points?"]
        },
        {
            keywords: ["video", "stuck", "looping", "repeating", "quiz", "proctoring", "camera"],
            answer: "If ViBe videos are stuck or looping, try <strong>clearing your browser cache</strong>. The system uses 'quiet helper' proctoring — avoid reading questions aloud or having others on camera.",
            followUp: ["What is ViBe?", "Who do I contact?"]
        },
        {
            keywords: ["team", "formation", "size", "member", "change", "dissolved", "teammate"],
            answer: "Teams are formed during designated activities. If you miss formation or need to <strong>change a teammate</strong> due to conflicts/inactivity, reach out to your mentor or the coordination team.",
            followUp: ["What do I work on?", "Who is my mentor?"]
        },
        {
            keywords: ["hello", "hi", "hey", "good morning", "good evening", "greetings", "hii", "hiii"],
            answer: "Hey there! 👋 Welcome to the Vicharanashala internship support. I'm Yaksha — ask me anything about VINS, NOCs, Spurti Points, ViBe, teams, and more!",
            followUp: ["What is VINS?", "What are Spurti Points?", "Tell me about ViBe"]
        },
        {
            keywords: ["thank", "thanks", "thankyou", "thank you", "thx"],
            answer: "You're welcome! 😊 Feel free to ask anything else. I'm here to help you succeed in your VINS journey!",
            followUp: ["What is VINS?", "What are Spurti Points?"]
        },
        {
            keywords: ["samagama", "platform", "portal", "website"],
            answer: "<strong>Samagama.in</strong> is the official platform for the Vicharanashala internship. You can find your dashboard, communicate with Yaksha, submit forms, and track your progress there.",
            followUp: ["What is VINS?", "How do I apply?"]
        },
        {
            keywords: ["room 62", "who made", "creator", "built by", "developer"],
            answer: "This chatbot was crafted with ❤️ by <strong>Room 62</strong> — building intelligent tools for the Vicharanashala Lab ecosystem.",
            followUp: ["What is VINS?", "Tell me about Yaksha"]
        }
    ];

    const defaultResponses = [
        "Interesting question! 🤔 For specifics not covered here, please visit <strong>samagama.in</strong> and ask Yaksha there.",
        "I'm not sure about that one. Try checking your <strong>dashboard</strong> or reaching out to the support team.",
        "Could you rephrase that? Or check the official <strong>Vicharanashala Lab FAQ</strong> for comprehensive details.",
        "I'm still learning! 📚 For this query, please check the <strong>official communication channels</strong>."
    ];

    function getCurrentTime() {
        const now = new Date();
        let h = now.getHours(), m = now.getMinutes();
        const ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
    }

    function appendMessage(sender, text, isHtml = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        if (isHtml) {
            contentDiv.innerHTML = text;
        } else {
            contentDiv.textContent = text;
        }

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('message-time');
        timeSpan.textContent = getCurrentTime();

        msgDiv.appendChild(contentDiv);
        msgDiv.appendChild(timeSpan);
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function addQuickReplies(suggestions) {
        // Remove any existing quick replies
        const existing = chatContainer.querySelector('.quick-replies');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.classList.add('quick-replies');

        suggestions.forEach(text => {
            const chip = document.createElement('button');
            chip.classList.add('quick-chip');
            chip.textContent = text;
            chip.addEventListener('click', () => {
                container.remove();
                userInput.value = text;
                handleSend();
            });
            container.appendChild(chip);
        });

        chatContainer.appendChild(container);
        scrollToBottom();
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    }

    function findAnswer(query) {
        query = query.toLowerCase().trim();
        
        let bestMatch = null;
        let maxScore = 0;

        for (const item of faqDB) {
            let score = 0;
            for (const keyword of item.keywords) {
                if (query.includes(keyword)) {
                    // Longer keywords get higher weight
                    score += 1 + keyword.length * 0.1;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestMatch = item;
            }
        }

        if (maxScore > 0 && bestMatch) {
            return bestMatch;
        }
        return {
            answer: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
            followUp: ["What is VINS?", "Tell me about ViBe", "What are Spurti Points?"]
        };
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.classList.add('message', 'bot-message');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content', 'typing-indicator');
        contentDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        msgDiv.appendChild(contentDiv);
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (text === '') return;

        // Remove existing quick replies
        const existing = chatContainer.querySelector('.quick-replies');
        if (existing) existing.remove();

        appendMessage('user', text);
        userInput.value = '';

        const typingId = showTypingIndicator();
        const delay = 500 + Math.random() * 800;

        setTimeout(() => {
            removeTypingIndicator(typingId);
            const result = findAnswer(text);
            appendMessage('bot', result.answer, true);

            // Show suggestion chips after bot responds
            if (result.followUp && result.followUp.length > 0) {
                setTimeout(() => {
                    addQuickReplies(result.followUp);
                }, 300);
            }
        }, delay);
    }

    // Event listeners
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
