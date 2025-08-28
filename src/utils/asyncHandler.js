// given by chaicode but chatgpt telling it is wrong
// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).
//         catch((err) => next(err));
//     }
// }


// correct one given by chatgpt
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch(next); 
};




// export default asyncHandler;
export {asyncHandler}


// const asyncHandler = () => {}

// // let me explain this to you carefully  (little bit undestood)
// 25 != 26 according to chatgpt
// const asyncHandler = (func) => {()=>{}}
// const asyncHandler = (fn) => () => {}


// const asyncHandler = (fn) =>() => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next)

//     } catch(error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//     })
// }
// }