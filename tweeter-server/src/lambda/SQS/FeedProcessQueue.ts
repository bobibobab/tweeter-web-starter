import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";

export const handler = async function (event: any) {
    const factory = new DAOsFactoryImpl();
    const feedDAO = factory.createFeedDAO();

    for (const record of event.Records) {
        const feed = JSON.parse(record.body); // check post's content if there is author name or not.

        console.log("FeedProcessQueue body: ", record.body);
        const receiver = feed.receiver;
        const status = feed.status;

        feedDAO.addFeed(status.user, status.timeStamp, status.post, receiver);
        
    }
    return null;
};