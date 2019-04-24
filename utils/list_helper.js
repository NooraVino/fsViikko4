const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const summa = blogs.reduce(function (sum, order) {
        return sum + order.likes
    }, 0)

    return summa
}

module.exports = {
    dummy,
    totalLikes
} 