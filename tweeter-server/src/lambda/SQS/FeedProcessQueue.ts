import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";

export const handler = async function (event: any) {
    const factory = new DAOsFactoryImpl();
    const feedDAO = factory.createFeedDAO();

    for (const record of event.Records) {
        const feeds = JSON.parse(record.body);
        const batchSize = 25;
        for (let i = 0; i < feeds.receiver.length; i += batchSize) {
            const followers = feeds.receiver.slice(i, i + batchSize);
            await feedDAO.addFeedsBatch(feeds.status.user, feeds.status.timestamp, feeds.status.post, followers);
        }
    }
    return null;
};
