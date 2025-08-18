const config = require('./dbConfig');
const sql = require('mssql');


async function getRequest(filters = {}) {
    try {
        let pool = await sql.connect(config);

        let query = "SELECT * FROM Client WHERE 1=1";
        const request = pool.request();

        if (filters.Id) {
            query += " AND Id = @Id";
            request.input("Id", sql.Int, filters.Id);
        }
        if (filters.First_Name) {
            query += " AND LOWER(First_Name) = LOWER(@First_Name)";
            request.input("First_Name", sql.NVarChar, filters.First_Name);
        }
        if (filters.Last_Name) {
            query += " AND LOWER(Last_Name) = LOWER(@Last_Name)";
            request.input("Last_Name", sql.NVarChar, filters.Last_Name);
        }
        if (filters.DOB) {
            query += " AND DOB = @DOB";
            request.input("DOB", sql.Date, filters.DOB);
        }

        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error("Error fetching client(s):", err);
        throw err;
    }
};


async function searchClient(filters) {
    return getRequest(filters);
};


async function createClient(Client) {
    try {
        let pool = await sql.connect(config);

        const dob = Client.DOB ? Client.DOB.split("T")[0] : null;

        const checkDuplicate = await pool.request()
            .input("First_Name", sql.NVarChar, Client.First_Name)
            .input("Last_Name", sql.NVarChar, Client.Last_Name)
            .input("DOB", sql.Date, Client.DOB)
            .query(`
        SELECT COUNT(*) AS count 
        FROM Client 
        WHERE First_Name=@First_Name 
          AND Last_Name=@Last_Name 
          AND DOB=@DOB
      `);

        if (checkDuplicate.recordset[0].count > 0) {
            return {
                success: false,
                message: `Duplicate client: ${Client.First_Name} ${Client.Last_Name}, DOB ${dob}`
            };
        }

        const result = await pool.request()
            .input("First_Name", sql.NVarChar, Client.First_Name)
            .input("Last_Name", sql.NVarChar, Client.Last_Name)
            .input("DOB", sql.Date, Client.DOB)
            .input("Income", sql.Decimal(10, 2), Client.Income || 0)
            .input("Disabled", sql.Bit, Client.Disabled ? 1 : 0)
            .input("Disability", sql.NVarChar, Client.Disability || "n/a")
            .input("Gender_Id", sql.Int, Client.Gender_Id)
            .query(`
        INSERT INTO Client (First_Name, Last_Name, DOB, Income, Disabled, Disability, Gender_Id)
        VALUES (@First_Name, @Last_Name, @DOB, @Income, @Disabled, @Disability, @Gender_Id);
      `);

        if (result.rowsAffected[0] > 0) {
            return { success: true, message: "Client created successfully" };
        } else {
            return { success: false, message: "Insert failed" };
        }

    } catch (err) {
        console.error("Error inserting client:", err);
        return { success: false, message: "Error inserting client: " + err.message };
    }
};

module.exports = {
    getRequest,
    searchClient,
    createClient,
};