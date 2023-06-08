

const paginatedResult = (
    data: object[],
    page: number,
    limit: number,
    ) => {
        const embedded: any = {}
           
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        if(endIndex < data.length) {
           embedded.next = {
                page: page + 1,
                limit: limit
           }
        }

        if(startIndex > 0) {
            embedded.prev = {
                page: page - 1,
                limit: limit
            }
        }
        embedded.totalPages = Math.round(data.length / limit)

        return {
            embedded,
            result: data.slice(startIndex, endIndex)
        };

}

export default paginatedResult;