const db = require('../src/config/postgres');
const { translateBearData, translateBatch } = require('../src/utils/translator');

const BATCH_SIZE = 15;
const DELAY_MS = 3000; // Delay giữa các batch để tránh rate limit

const migrate = async () => {
    console.log("Start migrating translations...");
    
    const { rows } = await db.query('SELECT fid, name, description FROM japan_bears WHERE name_en IS NULL');
    const totalRecords = rows.length;

    console.log(`Found ${totalRecords} records to translate.`);

    for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        console.log(`Translating batch ${i / BATCH_SIZE + 1} (${batch.length} records)...`);
        
        const translatedBatch = await translateBatch(batch);

        if (!translatedBatch || !Array.isArray(translatedBatch)) {
            console.error(`Batch failed at index ${i}. Skipping...`);
            continue;
        }

        const updatePromises = translatedBatch.map(item => {
            // Kiểm tra kỹ dữ liệu trước khi update
            if (!item.fid) return Promise.resolve(); 

            return db.query(`
                UPDATE japan_bears 
                SET name_en = $1, 
                    description_en = $2, 
                    name_vi = $3, 
                    description_vi = $4
                WHERE fid = $5
            `, [
                item.name_en, 
                item.description_en,
                item.name_vi, 
                item.description_vi,
                item.fid 
            ]);
        });

        await Promise.all(updatePromises);
        console.log(`Saved ${translatedBatch.length} records.`);

        // 3. Delay để bảo vệ API Limit
        console.log(`Sleeping ${DELAY_MS}ms...`);
        await new Promise(r => setTimeout(r, DELAY_MS));
    }

    
    console.log("Migration finished!");
    process.exit();
};

migrate();