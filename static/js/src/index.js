export const filterArr = function(arr,index) {
    var filterArr = arr.filter(function (value) {
        return index !== value;
    });
    return filterArr;
}