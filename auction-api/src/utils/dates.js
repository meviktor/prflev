const dates = {};

dates.isValidDate = function(d) {
    return !isNaN(d.valueOf());
}

export default dates;