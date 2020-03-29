const dates = {};

dates.isValidDate = function(d) {
    return d instanceof Date && !isNaN(d);
}

export default dates;