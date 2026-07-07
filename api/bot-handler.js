export async function onUpdate(data, botApi) {
    try {
        const message = data.message || data.channel_post;
        if (!message || !message.text) return;

        const chatId = message.chat.id;
        const message_id = message.message_id;
        const text = message.text.trim().toLowerCase();
        const userName = message.from ? message.from.first_name : "الغالي";

        // 1. التفاعلات التلقائية
        const myReactions = ["💘", "✨", "🤝", "💗"];
        const randomReaction = myReactions[Math.floor(Math.random() * myReactions.length)];
        await botApi.setMessageReaction(chatId, message_id, randomReaction).catch(() => {});

        // 2. أوامر الصيد (سداسي/سباعي)
        if (text === 'صيد' || text === '/hunt') {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789_";
            let foundUsers = [];
            
            for (let i = 0; i < 5; i++) {
                let len = Math.floor(Math.random() * 2) + 6; // 6 أو 7
                let user = "";
                for (let j = 0; j < len; j++) user += chars.charAt(Math.floor(Math.random() * chars.length));
                foundUsers.push(`\`${user}\``);
            }

            const huntText = `🚀 **جارِ توليد المقترحات يا مقتدى...**\n\n🎯 يوزرات مقترحة للفحص (سداسي/سباعي):\n${foundUsers.join('\n')}\n\n💡 استخدم سكربت البايثون الخاص بك لفحص المتاح منها الآن بنجاح.`;
            await botApi.sendMessage(chatId, huntText, "Markdown", message_id);
            return;
        }

        // 3. واجهة البداية /start
        if (text === '/start') {
            const welcomeText = `✨ **أهلاً بك يا مقتدى، نورت بحضورك** ✨\n\nأنا مساعدك الذكي المطور بلهجة عراقية واعية ورؤية برمجية متقدمة.\n\n📌 **أبرز الخدمات المتاحة:**\n• نقاشات واعية وإجابات ذكية بلهجتنا الطيبة.\n• تفاعل تلقائي ومدروس مع رسائلك.\n• اقتراح يوزرات للصيد (اكتب 'صيد').\n• دعم وتطوير أكواد البرمجة والأتمتة.\n\nتفضل بطرح استفسارك، وأنا بكامل الجاهزية لمساعدتك.`;
            await botApi.sendMessage(chatId, welcomeText, "Markdown", message_id);
            return;
        }

        // 4. الذكاء الاصطناعي (GROK / Llama-3.3)
        const GROQ_KEY = "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";
        
        const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `أنت 'مساعد مقتدى الشخصي'. شخصية واعية، مثقفة، ومحترمة جداً من الناصرية. 
                        - تتحدث بلهجة عراقية فصيحة، مهذبة ودافئة (مثل: "يا بعد روحي"، "تدلل عيني"، "نورت يا غالي").
                        - تبتعد عن الابتذال أو الهزل المفرط، وتتسم إجاباتك بالرزانة والعمق والمعرفة.
                        - تمتلك خبرة برمجية عالية جداً في لغة بايثون، الذكاء الاصطناعي، والأتمتة (Automation).
                        - إذا استشارك مقتدى في البرمجة أو الصيد، قدم له نصائح تقنية ذكية واحترافية تشجعه على التطور.
                        - استخدم الإيموجيات الهادئة والداعمة بذكاء (✨, 🚀, 🤝, 💡).` 
                    },
                    { role: "user", content: text }
                ]
            })
        });

        const resData = await aiResponse.json();

        if (resData.choices && resData.choices[0].message) {
            const reply = resData.choices[0].message.content;
            await botApi.sendMessage(chatId, reply, null, message_id);
        }

    } catch (e) {
        console.log("Error in Maktada Bot Logic");
    }
}
