const successResponse = (msg, results) => {
    return {
        success: true,
        msg: msg,
        result: results
    }
};

const errorResponse = (msg, err) => {
    return {
        success: false,
        msg: msg,
        error: err
    }
};

module.exports = {
    successResponse,
    errorResponse
};