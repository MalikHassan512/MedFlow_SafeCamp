/* Amplify Params - DO NOT EDIT
	API_AMPLIFYDATASOURCE_GRAPHQLAPIENDPOINTOUTPUT
	API_AMPLIFYDATASOURCE_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYDATASOURCE_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
	STORAGE_S322E1DA96_BUCKETNAME
Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
