const clientSummaryQuery = `SELECT 
        "clientID" as id,
        "clientName" as name,
        count( id ) filter(where result = 'Positive')
        "positiveCount",
        count( id ) filter(where result = 'Negative')
        "negativeCount",
        cast(count( id ) as int) as "totalTest"
        from "${process.env.PG_TEST}"
        otl
        group by "clientID", "clientName"
        order by "clientName"
        `;

const siteSummaryQuery = `SELECT 
        "siteID" as id,
        "site_name" as name,
        count( id ) filter(where result = 'Positive')
        "positiveCount",
        count( id ) filter(where result = 'Negative')
        "negativeCount",
        cast(count( id ) as int) as "totalTest"
        from "${process.env.PG_TEST}"
        otl
        group by "siteID", "site_name"
        order by "site_name"
        `;

const labSummaryQuery = `SELECT 
        "labID" as id,
        "labName" as name,
        count( id ) filter(where result = 'Positive')
        "positiveCount",
        count( id ) filter(where result = 'Negative')
        "negativeCount",
        cast(count( id ) as int) as "totalTest"
        from "${process.env.PG_TEST}"
        otl
        group by "labID", "labName"
        order by "labName"
        `;

const positiveTestList = `Select id, "labID", "siteID", "clientID", coalesce("resultDate","resultDateTime") as "resultDate" , "barcode" From "${process.env.PG_TEST}" where result = 'Positive' and status = 'Processed' order by "resultDate" desc`;

module.exports = { clientSummaryQuery, siteSummaryQuery, labSummaryQuery, positiveTestList };
