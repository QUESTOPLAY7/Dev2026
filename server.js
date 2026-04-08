// [ THE ARCHITECT ] - THE INFINITE ILLUSION ENGINE
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });
const SIGNAL_SEPARATOR = '\x1e';


console.log('[SYSTEM] السيرفر الأوتوماتيكي شاعل... كيتسنى الضحايا.');

// 1. دالة توليد رقم الكراش (The RNG Core)
function generateCrashPoint() {
    // كيعطينا رقم بين 1.01 و 10.00
    return (Math.random() * 9 + 1.01).toFixed(2);
}

// 2. دالة حساب الوقت (شحال غتطير الطيارة باش توصل لداك الرقم)
// الألعاب الحقيقية كتستعمل معادلات لوغاريتمية، هادي معادلة تقريبية:
function calculateFlightTime(crashPoint) {
    const baseTime = 3000; // 3 ثواني كحد أدنى
    const timeMultiplier = 2000; // كل فاصلة كنزيدو ثانيتين (مثال تقريبي)
    return baseTime + (parseFloat(crashPoint) * timeMultiplier);
}

// 3. الحلقة الزمنية اللانهائية (The Game Loop)
async function startGameLoop(ws) {
    let roundId = 1000000; // رقم الجولة

    while (ws.readyState === WebSocket.OPEN) {
        roundId++;
        
        // [المرحلة 1]: توليد النتيجة مسبقاً
        const secretCrashPoint = generateCrashPoint();
        console.log(`\n[>>>] جولة جديدة [${roundId}]: الطيارة غتفرقع فـ ${secretCrashPoint}x`);

        // [المرحلة 2]: إرسال التوقع السري للإضافة (باش تبينو فالشاشة للضحية)
        let predictionPayload = JSON.stringify({
            "type": 1, 
            "target": "OnPrediction", // هاد الرسالة كتقراها غير الإضافة باش تخدعك
            "arguments": [{"f": parseFloat(secretCrashPoint)}]
        });
        ws.send(predictionPayload + SIGNAL_SEPARATOR);
        console.log(`[+] تم إرسال الرقم للإضافة قبل الوقت.`);

        // [المرحلة 3]: فتح باب المراهنات الوهمية (كنتسناو 5 ثواني)
        console.log(`[+] مرحلة المراهنات... (5 ثواني)`);
        let stagePayload = JSON.stringify({"type":1,"target":"OnStage","arguments":[{"l":roundId}]});
        ws.send(stagePayload + SIGNAL_SEPARATOR);
        await new Promise(resolve => setTimeout(resolve, 5000));

        // [المرحلة 4]: إقلاع الطائرة!
        let startPayload = JSON.stringify({"type":1,"target":"OnStart","arguments":[{"l":roundId,"ts":Date.now()}]});
        ws.send(startPayload + SIGNAL_SEPARATOR);
        console.log(`[+] الطيارة طارت دابا!`);

        // [المرحلة 5]: حساب مدة الطيران والانتظار
        const flightTimeMs = calculateFlightTime(secretCrashPoint);
        console.log(`[+] السيرفر غينتظر ${flightTimeMs/1000} ثانية باش يفرقع الطيارة...`);
        
        // (هنا السيرفر يقدر يصيفط OnCashouts وهمية وسط هاد الانتظار باش تبان اللعبة حقيقية)
        
        await new Promise(resolve => setTimeout(resolve, flightTimeMs));

        // [المرحلة 6]: لحظة الانفجار (The Crash!)
        let crashPayload = JSON.stringify({
            "type":1,
            "target":"OnCrash",
            "arguments":[{"l":roundId, "f":parseFloat(secretCrashPoint), "ts":Date.now()}]
        });
        ws.send(crashPayload + SIGNAL_SEPARATOR);
        console.log(`[-] بوم! الطيارة تفرقعات فـ ${secretCrashPoint}x`);

        // [المرحلة 7]: نهاية الجولة، استراحة 3 ثواني قبل الجولة الجاية
        console.log(`[+] استراحة الجولة...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

// تشغيل النظام فاش كيتصل شي متصفح
wss.on('connection', function connection(ws) {
    console.log('[+] العميل (الإضافة) اتصل بالسيرفر بنجاح!');
    
    // إطلاق الحلقة اللانهائية لهاد العميل
    startGameLoop(ws);

    ws.on('close', () => {
        console.log('[-] العميل قطع الاتصال. الحلقة غتوقف.');
    });
});
