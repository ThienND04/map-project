const db = require('../src/config/postgres');
const { translateBearData } = require('../src/utils/translator');

const testTranslate = async () => {
    console.log("Start migrating translations...");
    
    const { rows } = await db.query('SELECT fid, name, description FROM japan_bears WHERE name_en IS NULL');
    
    console.log(`Found ${rows.length} records to translate.`);

    for (const bear of rows) {
        console.log(`Translating ID: ${bear.id} - ${bear.name}...`);
        console.log("Original data:", { name: bear.name, description: bear.description });
        
        const translated = await translateBearData(bear.name, bear.description);
        
        console.log("Translated data:", translated);
        
        // Delay nhẹ 1-2s để tránh bị Google chặn vì spam request (Rate limit)
        await new Promise(r => setTimeout(r, 2000));
        break;
    }
    
    console.log("Migration finished!");
    process.exit();
};

testTranslate();