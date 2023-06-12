

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
        const totalpages = Math.round(data.length / limit)
        embedded.totalPages = totalpages === 0 ? 1 : totalpages 
        embedded.totalResults = data.length

        return {
            embedded,
            result: data.slice(startIndex, endIndex)
        };

}

export default paginatedResult;